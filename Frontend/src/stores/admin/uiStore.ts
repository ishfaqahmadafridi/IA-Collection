import { registerSessionReset } from '../../utils/session';
import { create, StateCreator } from 'zustand';
import { Product } from '../../types/components/admin/adminProducts/adminProductsInterface';
import { Order } from '../../types/components/admin/adminOrders/adminOrdersInterface';

export interface UiState {
  currentView: 'dashboard' | 'products' | 'orders' | 'analytics';
  selectedProduct: Product | null;
  selectedOrder: Order | null;

  setCurrentView: (view: 'dashboard' | 'products' | 'orders' | 'analytics') => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: Order | null) => void;
}

export const uiStoreInitializer: StateCreator<UiState> = (set) => ({
  currentView: 'dashboard',
  selectedProduct: null,
  selectedOrder: null,

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
});

export const useUiStore = create<UiState>()(uiStoreInitializer);

registerSessionReset(() => useUiStore.setState(useUiStore.getInitialState()));
