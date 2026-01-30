export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'created' | 'paid' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  items: OrderItem[];
}
