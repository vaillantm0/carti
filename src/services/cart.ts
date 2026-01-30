import { api } from './api';
import axios from 'axios';
import type { Cart, Order, AddToCartPayload, UpdateQuantityPayload, RemoveFromCartPayload } from '../models/cart';

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== 'false';

let mockCart: Cart = {
  id: 'cart-1',
  userId: 'user-1',
  items: [],
};

let mockOrders: Order[] = [];

export async function getMyCart(): Promise<Cart> {
  if (USE_MOCK) return mockCart;
  const { data } = await api.get<Cart>('/api/cart');
  return data;
}

export async function addItem(payload: AddToCartPayload): Promise<Cart> {
  // Use the provided productId if it's a 24-char hex ObjectId; otherwise generate a placeholder
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(payload.productId);
  const normalizedPayload = {
    productId: isValidObjectId ? payload.productId : `507f1f77bcf86cd799439011`, // Example ObjectId placeholder
    quantity: payload.quantity ?? 1,
  };
  console.debug('[Cart Service] addItem payload (original):', payload);
  console.debug('[Cart Service] addItem payload (normalized):', normalizedPayload);
  if (USE_MOCK) {
    const existingItem = mockCart.items.find(item => item.productId === payload.productId);
    if (existingItem) {
      existingItem.quantity += payload.quantity ?? 1;
    } else {
      mockCart.items.push({ productId: payload.productId, quantity: payload.quantity ?? 1 });
    }
    return mockCart;
  }
  try {
    const { data } = await api.post<Cart>('/api/cart/add', normalizedPayload);
    console.debug('[Cart Service] addItem response:', data);
    return data;
  } catch (err) {
    console.error('[Cart Service] addItem error:', err);
    if (axios.isAxiosError(err) && err.response) {
      console.error('[Cart Service] Server response (data):', (err as any).response.data);
      console.error('[Cart Service] Server response (text):', (err as any).response?.data instanceof Object ? JSON.stringify((err as any).response.data, null, 2) : (err as any).response?.data);
      console.error('[Cart Service] Server status:', (err as any).response.status);
      console.error('[Cart Service] Server headers:', (err as any).response.headers);
    }
    throw err;
  }
}

export async function updateQuantity(payload: UpdateQuantityPayload): Promise<Cart> {
  if (USE_MOCK) {
    const item = mockCart.items.find(item => item.productId === payload.productId);
    if (item) {
      item.quantity = payload.quantity;
    }
    return mockCart;
  }
  const { data } = await api.patch<Cart>('/api/cart/quantity', payload);
  return data;
}

export async function removeItem(payload: RemoveFromCartPayload): Promise<Cart> {
  if (USE_MOCK) {
    mockCart.items = mockCart.items.filter(item => item.productId !== payload.productId);
    return mockCart;
  }
  const { data } = await api.delete<Cart>('/api/cart/remove', { data: payload });
  return data;
}

export async function clearCart(): Promise<void> {
  if (USE_MOCK) {
    mockCart.items = [];
    return;
  }
  await api.delete('/api/cart/clear');
}

export async function createOrder(): Promise<Order> {
  if (USE_MOCK) {
    if (mockCart.items.length === 0) throw new Error('Cart is empty');
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: mockCart.userId,
      items: mockCart.items.map(item => ({
        productId: item.productId,
        name: `Product ${item.productId}`,
        price: 10,
        quantity: item.quantity,
      })),
      totalAmount: mockCart.items.reduce((sum, item) => sum + 10 * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    mockCart.items = [];
    return newOrder;
  }
  const { data } = await api.post<Order>('/api/orders');
  return data;
}

export async function getMyOrders(): Promise<Order[]> {
  if (USE_MOCK) return mockOrders;
  const { data } = await api.get<Order[]>('/api/orders');
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  if (USE_MOCK) {
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  }
  const { data } = await api.get<Order>(`/api/orders/${id}`);
  return data;
}

export async function cancelOrder(id: string): Promise<Order> {
  if (USE_MOCK) {
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'pending') throw new Error('Cannot cancel');
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    return order;
  }
  const { data } = await api.patch<Order>(`/api/orders/${id}/cancel`);
  return data;
}
