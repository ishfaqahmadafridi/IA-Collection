import OrderStatusBadge from './OrderStatusBadge';
import type { OrderTableRowProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function OrderTableRow({ order }: OrderTableRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.order_number}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{order.user_name}</td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">PKR {order.total_amount}</td>
      <td className="py-3 px-4">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
    </tr>
  );
}
