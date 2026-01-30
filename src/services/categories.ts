import { api } from './api';
import type { Category } from '../models/category';
import { mockCategories as dataCategories } from '../data/categories';

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== 'false';

let mockCategories: Category[] = dataCategories;

type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

function mapBackendCategory(c: BackendCategory): Category {
  return {
    id: c.id,
    name: c.name,
    path: c.slug,
    image: c.image,
  };
}

export async function getAll(): Promise<Category[]> {
  if (USE_MOCK) return mockCategories;
  const { data } = await api.get<BackendCategory[]>('/api/categories');
  return data.map(mapBackendCategory);
}

export async function getById(id: string): Promise<Category> {
  if (USE_MOCK) {
    const c = mockCategories.find(c => c.id === id);
    if (!c) throw new Error('Category not found');
    return c;
  }
  const { data } = await api.get<BackendCategory>(`/api/categories/${id}`);
  return mapBackendCategory(data);
}

export async function create(payload: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
  if (USE_MOCK) {
    const id = payload.id ?? payload.path;
    const newC: Category = { id, ...payload } as Category;
    mockCategories.push(newC);
    return newC;
  }
  const { data } = await api.post<Category>('/api/categories', payload);
  return data;
}

export async function update(id: string, payload: Partial<Omit<Category, 'id'>>): Promise<Category> {
  if (USE_MOCK) {
    const idx = mockCategories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    mockCategories[idx] = { ...mockCategories[idx], ...payload } as Category;
    return mockCategories[idx];
  }
  const { data } = await api.put<Category>(`/api/categories/${id}`, payload);
  return data;
}

export async function remove(id: string): Promise<void> {
  if (USE_MOCK) {
    mockCategories = mockCategories.filter(c => c.id !== id);
    return;
  }
  await api.delete(`/api/categories/${id}`);
}
