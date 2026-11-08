// src/zustand/admin/productsStore.ts

import type { ProductWrite } from '../../services/adminService';
import { create, StateCreator } from 'zustand';
import { adminService } from '../../services/adminService';
import { errorMessage } from '../../utils/errors';
import { registerSessionReset } from '../../utils/session';
import { Product, InventoryStatus } from '../../types/components/admin/adminProducts/adminProductsInterface';

// Full store interface (data + actions)
export interface ProductsState {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  inventoryStatus: InventoryStatus;
  lowStockProducts: Product[];          // ← improve to proper type if possible
  outOfStockProducts: Product[];        // ← improve to proper type if possible

  fetchAllProducts: () => Promise<void>;
  createProduct: (data: ProductWrite) => Promise<void>;
  updateProduct: (id: string, data: ProductWrite) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductStock: (id: string, stock: number) => Promise<void>;
  fetchInventoryStatus: () => Promise<void>;
  fetchLowStockProducts: () => Promise<void>;
  fetchOutOfStockProducts: () => Promise<void>;
}

// Optional: export the initializer separately (good for slices / testing)
export const productsStoreInitializer: StateCreator<ProductsState> = (set) => ({
  products: [],
  productsLoading: false,
  productsError: null,
  inventoryStatus: {},
  lowStockProducts: [],
  outOfStockProducts: [],

  fetchAllProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const res = await adminService.products();
      set({ products: Array.isArray(res) ? res : [], productsLoading: false });
    } catch (err) {
      set({ productsError: errorMessage(err) || 'Failed to fetch products', productsLoading: false });
    }
  },

  createProduct: async (data) => {
    set({ productsLoading: true });
    try {
      const res = await adminService.createProduct(data);
      set((state) => ({
        products: [...state.products, res],
        productsLoading: false,
      }));
    } catch (err) {
      set({ productsError: errorMessage(err), productsLoading: false });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    set({ productsLoading: true });
    try {
      const res = await adminService.updateProduct(id, data);
      set((state) => {
        const idx = state.products.findIndex((p) => p.id === Number(id));
        if (idx === -1) return { productsLoading: false };
        return {
          products: state.products.map((p, i) => (i === idx ? res : p)),
          productsLoading: false,
        };
      });
    } catch (err) {
      set({ productsError: errorMessage(err), productsLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ productsLoading: true });
    try {
      await adminService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== Number(id)),
        productsLoading: false,
      }));
    } catch (err) {
      set({ productsError: errorMessage(err), productsLoading: false });
      throw err;
    }
  },

  updateProductStock: async (id, stock) => {
    set({ productsLoading: true });
    try {
      const res = await adminService.stock(id, stock);
      set((state) => {
        const idx = state.products.findIndex((p) => p.id === Number(id));
        if (idx === -1) return { productsLoading: false };
        return {
          products: state.products.map((p, i) => (i === idx ? res : p)),
          productsLoading: false,
        };
      });
    } catch (err) {
      set({ productsError: errorMessage(err), productsLoading: false });
      throw err;
    }
  },

  fetchInventoryStatus: async () => {
    try {
      const res = await adminService.inventory();
      set({ inventoryStatus: res ?? {} });
    } catch (error) {
      set({ productsError: errorMessage(error) });
    }
  },

  fetchLowStockProducts: async () => {
    try {
      const res = await adminService.lowStock();
      set({ lowStockProducts: res ?? [] });
    } catch (error) {
      set({ productsError: errorMessage(error) });
    }
  },

  fetchOutOfStockProducts: async () => {
    try {
      const res = await adminService.outOfStock();
      set({ outOfStockProducts: res ?? [] });
    } catch (error) {
      set({ productsError: errorMessage(error) });
    }
  },
});

// Final exported hook — this is what you import
export const useProductsStore = create<ProductsState>()(productsStoreInitializer);
registerSessionReset(() => useProductsStore.setState(useProductsStore.getInitialState()));
