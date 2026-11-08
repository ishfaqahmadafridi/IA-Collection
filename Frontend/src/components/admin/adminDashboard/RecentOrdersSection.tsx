import RecentOrdersTable from './RecentOrdersTable';
import type { RecentOrdersSectionProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function RecentOrdersSection({ recent_Orders }: RecentOrdersSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
      <RecentOrdersTable orders={recent_Orders} />
    </div>
  );
}
