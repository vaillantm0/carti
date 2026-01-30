import { api } from './api';
import type { Product } from '../models/product';

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== 'false';

let mockProducts: Product[] = [
  { id: 1, name: 'Gold Peacock Earrings', tags: 'EARRINGS', price: 48, rating: 3, img: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400' },
  { id: 6, name: 'Blue Mid-Top Sneakers', tags: 'SNEAKERS', price: 45, rating: 5, img: 'https://res.cloudinary.com/dl4biwzn8/image/upload/v1769517444/Men-Blue-Colourblocked-Mid-Top-Sneakers_c19yos.jpg' },
  { id: 12, name: 'Classic White Linen Shirt', tags: 'SHIRTS', price: 55, rating: 5, img: 'https://res.cloudinary.com/dl4biwzn8/image/upload/v1769517259/classic-tshirt-mockup_85212-2025_yuxd0v.jpg' },
];

type BackendProduct = {
  id?: string; // some APIs use 'id'
  _id?: string; // mongoose uses '_id'
  name: string;
  slug?: string;
  description?: string;
  price: number;
  quantity?: number;
  images?: string[];
  category?: string; // category slug if provided
  categoryId?: string; // mongoose relation id
  vendorId?: string;
};

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function mapBackendProduct(p: BackendProduct): Product {
  const idStr = (p.id || p._id || '') as string;
  const categoryTag = p.category
    ? p.category.toUpperCase()
    : p.categoryId
      ? 'CATEGORY'
      : 'UNCATEGORIZED';
  const img = p.images && p.images.length > 0
    ? p.images[0]
    : 'https://via.placeholder.com/400x400?text=No+Image';

  return {
    id: idStr ? hashStringToInt(idStr) : Math.max(1, Math.floor(Math.random() * 1e6)),
    name: p.name,
    tags: categoryTag,
    price: p.price,
    rating: 4,
    img,
  };
}

export async function getAll(): Promise<Product[]> {
  if (USE_MOCK) return mockProducts;
  const { data } = await api.get<BackendProduct[]>('/api/products');
  return data.map(mapBackendProduct);
}

export async function getByCategory(category: string): Promise<Product[]> {
  if (USE_MOCK) {
    return mockProducts.filter(p => p.tags?.toLowerCase() === category.toLowerCase());
  }
  // If the provided value looks like a Mongo ObjectId, use categoryId; otherwise use slug 'category'
  const isObjectId = /^[a-f0-9]{24}$/i.test(category);
  const params = isObjectId ? { categoryId: category } : { category } as Record<string, string>;
  const { data } = await api.get<BackendProduct[]>('/api/products', { params });
  return data.map(mapBackendProduct);
}

export async function getById(id: number): Promise<Product> {
  if (USE_MOCK) {
    const p = mockProducts.find(p => p.id === id);
    if (!p) throw new Error('Product not found');
    return p;
  }
  // Backend uses string IDs; we can't reverse-map from numeric hash. Fetch all and match by hash.
  const { data } = await api.get<BackendProduct[]>(`/api/products`);
  const found = data.find(p => hashStringToInt((p.id || p._id) as string) === id);
  if (!found) throw new Error('Product not found');
  return mapBackendProduct(found);
}

export async function create(payload: Omit<Product, 'id'>): Promise<Product> {
  if (USE_MOCK) {
    const newP: Product = { ...payload, id: Math.max(0, ...mockProducts.map(p => p.id)) + 1 } as Product;
    mockProducts.push(newP);
    return newP;
  }
  const { data } = await api.post<Product>('/api/products', payload);
  return data;
}

export async function update(id: number, payload: Partial<Omit<Product, 'id'>>): Promise<Product> {
  if (USE_MOCK) {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    mockProducts[idx] = { ...mockProducts[idx], ...payload } as Product;
    return mockProducts[idx];
  }
  const { data } = await api.put<Product>(`/api/products/${id}`, payload);
  return data;
}

export async function remove(id: number): Promise<void> {
  if (USE_MOCK) {
    mockProducts = mockProducts.filter(p => p.id !== id);
    return;
  }
  await api.delete(`/api/products/${id}`);
}
