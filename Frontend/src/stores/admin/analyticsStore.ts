import { create } from 'zustand';
import { adminService } from '../../services/adminService';
import { errorMessage } from '../../utils/errors';
import { registerSessionReset, sessionVersion } from '../../utils/session';
import type { SalesAnalytics, UserAnalytics, TopProduct } from '../../types/components/admin/adminAnalytics/adminAnalyticsInterface';
interface AnalyticsState {
  salesAnalytics: SalesAnalytics | null;
  userAnalytics: UserAnalytics | null;
  topProducts: TopProduct[];
  analyticsLoading: boolean;
  analyticsError: string | null;
  pendingRequests: number;
  fetchSalesAnalytics: (period?: string) => Promise<void>;
  fetchUserAnalytics: (period?: string) => Promise<void>;
  fetchTopSellingProducts: (limit?: number) => Promise<void>;
}
export const useAnalyticsStore = create<AnalyticsState>((set) => {
  async function load<T>(fetch: () => Promise<T>, apply: (value: T) => Partial<AnalyticsState>) {
    const version = sessionVersion();
    set(state => ({ pendingRequests: state.pendingRequests + 1, analyticsLoading: true, analyticsError: null }));
    try { const value = await fetch(); if (version === sessionVersion()) set(apply(value)); }
    catch (error) { if (version === sessionVersion()) set({ analyticsError: errorMessage(error) }); }
    finally {
      if (version === sessionVersion()) set(state => ({ pendingRequests: state.pendingRequests - 1, analyticsLoading: state.pendingRequests > 1 }));
    }
  }
  return {
    salesAnalytics: null, userAnalytics: null, topProducts: [], analyticsLoading: false, analyticsError: null, pendingRequests: 0,
    fetchSalesAnalytics: (period = 'week') => load(() => adminService.sales(period), salesAnalytics => ({ salesAnalytics })),
    fetchUserAnalytics: (period = 'week') => load(() => adminService.users(period), userAnalytics => ({ userAnalytics })),
    fetchTopSellingProducts: (limit = 10) => load(() => adminService.topProducts(limit), topProducts => ({ topProducts })),
  };
});
registerSessionReset(() => useAnalyticsStore.setState(useAnalyticsStore.getInitialState()));
