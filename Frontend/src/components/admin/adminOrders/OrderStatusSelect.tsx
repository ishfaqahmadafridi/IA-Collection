import { ORDER_STATUS_LABELS } from '../../../constants/orders';
import { useOrdersStore } from '../../../stores/admin/ordersStore';
import type { OrderStatusSelectProps } from '../../../types/components/admin/adminOrders/adminOrdersInterface';
import type { ChangeEvent } from 'react';

export default function OrderStatusSelect({ order }: OrderStatusSelectProps) {
  const { updateOrderStatus } = useOrdersStore();

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    processing: 'text-blue-600 bg-blue-50',
    shipped: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatus(order.id, e.target.value);
  };

  return (
    <select
      aria-label={`Status for order ${order.order_number}`}
      value={order.status}
      onChange={handleStatusChange}
      className={`px-3 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${
        statusColors[order.status] || 'bg-gray-50 text-gray-600'
      }`}
    >
      {(order.allowed_statuses || [order.status]).map(status => <option key={status} value={status}>{ORDER_STATUS_LABELS[status] || status}</option>)}
    </select>
  );
}
