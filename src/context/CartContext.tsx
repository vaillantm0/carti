import React, { createContext, useContext, useMemo } from 'react';
import { useCart as useCartQuery, useAddToCart, useUpdateQuantity, useRemoveFromCart, useClearCart } from '../hooks/useCart';
import type { CartItem } from '../models/cart';

type CartContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: cart, isLoading } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateQuantityMutation = useUpdateQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const addItem = (productId: string, quantity = 1) => {
    addToCartMutation.mutate({ productId, quantity });
  };

  const removeItem = (productId: string) => {
    removeFromCartMutation.mutate({ productId });
  };

  const updateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantityMutation.mutate({ productId, quantity });
    }
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  // For UI compatibility, map backend CartItem to CartItem with name/price/img if needed
  const items: CartItem[] = (cart?.items ?? []).map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const subtotal = useMemo(() => {
    // TODO: Compute real subtotal using product prices; for now, mock with $10 per item
    return items.reduce((s, i) => s + 10 * i.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    isOpen,
    open,
    close,
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    isLoading,
    subtotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
