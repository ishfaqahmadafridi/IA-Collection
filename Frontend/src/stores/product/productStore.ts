import { create } from 'zustand';

interface ProductState {
  selectedSize: string | null;
  quantity: number;

  setSelectedSize: (size: string | null) => void;
  setQuantity: (qty: number) => void;
  resetProductState: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedSize: null,
  quantity: 1,

  setSelectedSize: (size) => set({ selectedSize: size }),
  setQuantity: (qty) => set({ quantity: Math.max(1, qty) }),
  resetProductState: () => set({ selectedSize: null, quantity: 1 }),
}));
