import OrderStatusCard from './OrderStatusCard';
import type { OrderStatsGridProps } from '../../../types/components/admin/adminOrders/adminOrdersInterface';

export default function OrderStatsGrid({ stats }: OrderStatsGridProps) {
  const cards = [
    { label: 'Total Orders', value: stats?.total || 0, color: 'bg-blue-500' },
    { label: 'Pending', value: stats?.pending || 0, color: 'bg-yellow-500' },
    { label: 'Processing', value: stats?.processing || 0, color: 'bg-indigo-500' },
    { label: 'Shipped', value: stats?.shipped || 0, color: 'bg-purple-500' },
    { label: 'Delivered', value: stats?.delivered || 0, color: 'bg-green-500' },
    { label: 'Cancelled', value: stats?.cancelled || 0, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <OrderStatusCard key={index} {...card} />
      ))}
    </div>
  );
}
