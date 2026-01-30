import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as OrderService from '../services/orders';

const keys = {
  all: ['orders'] as const,
  byId: (id: string) => [...keys.all, id] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: keys.all,
    queryFn: OrderService.list,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => OrderService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: OrderService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: OrderService.cancel,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: keys.all });
      if (typeof id === 'string') qc.invalidateQueries({ queryKey: keys.byId(id) });
    },
  });
}
