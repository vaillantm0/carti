import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as CartService from '../services/cart';
import type { Cart, Order, AddToCartPayload, UpdateQuantityPayload, RemoveFromCartPayload } from '../models/cart';
import { useAuthContext } from '../context/AuthContext';

const keys = {
  cart: ['cart'] as const,
  orders: ['orders'] as const,
  order: (id: string) => [...keys.orders, id] as const,
};

export function useCart() {
  const { token } = useAuthContext();
  return useQuery<Cart, Error>({
    queryKey: keys.cart,
    queryFn: CartService.getMyCart,
    enabled: !!token, // Only fetch if token exists
    retry: (failureCount, error) => {
      // Don't retry on 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, AddToCartPayload>({
    mutationFn: CartService.addItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cart }),
  });
}

export function useUpdateQuantity() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, UpdateQuantityPayload>({
    mutationFn: CartService.updateQuantity,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cart }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation<Cart, Error, RemoveFromCartPayload>({
    mutationFn: CartService.removeItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cart }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: CartService.clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cart }),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, void>({
    mutationFn: CartService.createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cart });
      qc.invalidateQueries({ queryKey: keys.orders });
    },
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: keys.orders,
    queryFn: CartService.getMyOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: keys.order(id),
    queryFn: () => CartService.getOrder(id),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation<Order, Error, string>({
    mutationFn: CartService.cancelOrder,
    onSuccess: (_, orderId) => {
      qc.invalidateQueries({ queryKey: keys.orders });
      qc.invalidateQueries({ queryKey: keys.order(orderId) });
    },
  });
}
