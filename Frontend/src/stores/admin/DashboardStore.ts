import { devtools } from "zustand/middleware";
import { adminService } from '../../services/adminService';
import { errorMessage } from '../../utils/errors';
import { registerSessionReset } from '../../utils/session';
import { DashboardStats, Order } from '../../types/components/admin/adminDashboard/adminDashboardInterface';
import { create } from "zustand/react";

interface DashboardState {
  dashboardStats: DashboardStats | null;
  statsLoading: boolean;
  statsError: string | null;
  recent_Orders: Order[];


  fetchDashboardStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      dashboardStats: null,
      statsLoading: false,
      statsError: null,
      recent_Orders: [],

      fetchDashboardStats: async () => {
        set({ statsLoading: true, statsError: null });
        try {
          const [statsRes, recentOrdersRes] = await Promise.all([
            adminService.dashboard(),
            adminService.recentOrders()
          ]);

          set({
            dashboardStats: statsRes,
            recent_Orders: recentOrdersRes,
            statsLoading: false,
          });
        } catch (error) {
          set({
            statsError: errorMessage(error) || 'Failed to load dashboard stats',
            statsLoading: false,
          });
        }
      },
    }),
    { name: 'DashboardStore' } // nice label in devtools
  )
);

registerSessionReset(() => useDashboardStore.setState(useDashboardStore.getInitialState()));
