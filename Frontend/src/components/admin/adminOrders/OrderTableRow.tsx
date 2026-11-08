import OrderStatusSelect from './OrderStatusSelect';
import type { OrderTableRowProps } from '../../../types/components/admin/adminOrders/adminOrdersInterface';

export default function OrderTableRow({ order, onViewDetails }: OrderTableRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.order_number}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{order.user_name}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{order.items?.length || 0}</td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900">${order.total_amount}</td>
      <td className="py-3 px-4">
        <OrderStatusSelect order={order} />
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">
        {new Date(order.created_at).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={onViewDetails}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}
