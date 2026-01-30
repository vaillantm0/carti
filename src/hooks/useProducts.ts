import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ProductService from '../services/products';
import type { Product } from '../models/product';

const keys = {
  all: ['products'] as const,
  byId: (id: number) => [...keys.all, id] as const,
  byCategory: (category: string) => [...keys.all, 'category', category] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: keys.all,
    queryFn: ProductService.getAll,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => ProductService.getById(id),
    enabled: !!id,
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: keys.byCategory(category),
    queryFn: () => ProductService.getByCategory(category),
    enabled: !!category,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Product, 'id'>) => ProductService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Product, 'id'>> }) => ProductService.update(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: keys.all });
      qc.invalidateQueries({ queryKey: keys.byId(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ProductService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}
