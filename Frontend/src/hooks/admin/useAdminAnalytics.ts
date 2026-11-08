import { useEffect } from 'react';
import { useAnalyticsStore } from '../../stores/admin/analyticsStore';
export function useAdminAnalytics() {
  const salesAnalytics = useAnalyticsStore(state => state.salesAnalytics);
  const userAnalytics = useAnalyticsStore(state => state.userAnalytics);
  const topProducts = useAnalyticsStore(state => state.topProducts);
  const loading = useAnalyticsStore(state => state.analyticsLoading);
  const error = useAnalyticsStore(state => state.analyticsError);
  const fetchSales = useAnalyticsStore(state => state.fetchSalesAnalytics);
  const fetchUsers = useAnalyticsStore(state => state.fetchUserAnalytics);
  const fetchProducts = useAnalyticsStore(state => state.fetchTopSellingProducts);
  useEffect(() => { void fetchSales(); void fetchUsers(); void fetchProducts(); }, [fetchSales, fetchUsers, fetchProducts]);
  function retry() { void fetchSales(); void fetchUsers(); void fetchProducts(); }
  return { salesAnalytics, userAnalytics, topProducts, loading, error, retry };
}
