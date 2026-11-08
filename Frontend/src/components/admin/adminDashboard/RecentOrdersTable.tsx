import OrderTableRow from './OrderTableRow';
import type { RecentOrdersTableProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order #</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 10).map((order) => (
            <OrderTableRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
