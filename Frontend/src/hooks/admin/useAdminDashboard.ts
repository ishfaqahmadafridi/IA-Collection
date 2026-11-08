import { useEffect } from 'react';
import { useDashboardStore } from '../../stores/admin/DashboardStore';
export function useAdminDashboard() {
  const stats = useDashboardStore(state => state.dashboardStats);
  const recentOrders = useDashboardStore(state => state.recent_Orders);
  const loading = useDashboardStore(state => state.statsLoading);
  const error = useDashboardStore(state => state.statsError);
  const retry = useDashboardStore(state => state.fetchDashboardStats);
  useEffect(() => { if (stats === null) void retry(); }, [stats, retry]);
  return { stats, recentOrders, loading, error, retry };
}
