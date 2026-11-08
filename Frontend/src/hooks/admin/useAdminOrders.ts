import { useEffect, useState } from 'react';
import { useOrdersStore } from '../../stores/admin/ordersStore';
import { summarizeOrders, filterOrders } from '../../utils/admin/orders';
export function useAdminOrders() {
  const orders = useOrdersStore(state => state.orders);
  const loading = useOrdersStore(state => state.ordersLoading);
  const error = useOrdersStore(state => state.ordersError);
  const fetchAllOrders = useOrdersStore(state => state.fetchAllOrders);
  const [activeFilter, setActiveFilter] = useState('all');
  useEffect(() => { void fetchAllOrders(); }, [fetchAllOrders]);
  return { loading, error, fetchAllOrders, activeFilter, setActiveFilter, stats: summarizeOrders(orders), filteredOrders: filterOrders(orders, activeFilter) };
}
