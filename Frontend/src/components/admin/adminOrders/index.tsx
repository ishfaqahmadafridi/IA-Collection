import { useAdminOrders } from '../../../hooks/admin/useAdminOrders';
import OrdersHeader from './OrdersHeader';
import OrderStatsGrid from './OrderStatsGrid';
import OrderFilterTabs from './OrderFilterTabs';
import OrdersTable from './OrdersTable';
import LoadingSpinner from './LoadingSpinner';

export default function AdminOrders() {
  const { loading, error, fetchAllOrders, activeFilter, setActiveFilter, stats, filteredOrders } = useAdminOrders();
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) return <div role="alert" className="p-6 space-y-4"><p>{error}</p><button onClick={() => { void fetchAllOrders(); }} className="underline">Try again</button></div>;

  return (
    <div className="space-y-6 py-2">
      <OrdersHeader />
      <OrderStatsGrid stats={stats} />
      <OrderFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      {filteredOrders.length ? <OrdersTable orders={filteredOrders} /> : <p role="status">No orders match this filter.</p>}
    </div>
  );
}
