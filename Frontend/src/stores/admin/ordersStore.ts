import { create, StateCreator } from 'zustand';
import { adminService } from '../../services/adminService';
import { errorMessage } from '../../utils/errors';
import { registerSessionReset } from '../../utils/session';
import { Order } from '../../types/components/admin/adminOrders/adminOrdersInterface';

export interface OrdersState {
  orders: Order[];
  recentOrders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;

  fetchAllOrders: () => Promise<void>;
  fetchRecentOrders: (days?: number) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
}

export const ordersStoreInitializer: StateCreator<OrdersState> = (set) => ({
  orders: [],
  recentOrders: [],
  ordersLoading: false,
  ordersError: null,

  fetchAllOrders: async () => {
    set({ ordersLoading: true, ordersError: null });
    try {
      const res = await adminService.orders();
      set({ orders: Array.isArray(res) ? res : [], ordersLoading: false });
    } catch (err) {
      set({ ordersError: errorMessage(err) || 'Failed to fetch orders', ordersLoading: false });
    }
  },

  fetchRecentOrders: async (days = 7) => {
    set({ ordersLoading: true });
    try {
      const res = await adminService.recentOrders(days);
      set({ recentOrders: Array.isArray(res) ? res : [], ordersLoading: false });
    } catch (err) {
      set({ recentOrders: [], ordersLoading: false, ordersError: errorMessage(err) });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ ordersLoading: true });
    try {
      const res = await adminService.updateOrder(id, status);
      set((state) => {
        const idx = state.orders.findIndex((o) => o.id === id);
        if (idx === -1) return { ordersLoading: false };
        return {
          orders: state.orders.map((o, i) => (i === idx ? res : o)),
          ordersLoading: false,
        };
      });
    } catch (err) {
      set({ ordersError: errorMessage(err) || 'Failed to update order status', ordersLoading: false });
    }
  },
});

export const useOrdersStore = create<OrdersState>()(ordersStoreInitializer);

registerSessionReset(() => useOrdersStore.setState(useOrdersStore.getInitialState()));
