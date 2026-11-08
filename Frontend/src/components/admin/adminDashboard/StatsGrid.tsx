import StatCard from './StatCard';
import { IoCashOutline, IoCartOutline, IoCubeOutline, IoPeopleOutline, IoMailOutline, IoAlertCircleOutline } from 'react-icons/io5';
import type { StatsGridProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      title: 'Total Sales',
      value: `$${stats.sales?.total?.toFixed(2) || 0}`,
      subtitle: `$${stats.sales?.weekly?.toFixed(2) || 0} this week`,
      icon: IoCashOutline,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      subtitle: `${stats.orders?.pending || 0} pending`,
      icon: IoCartOutline,
      color: 'bg-blue-500',
    },
    {
      title: 'Products',
      value: stats.products?.total || 0,
      subtitle: `${stats.products?.out_of_stock || 0} out of stock`,
      icon: IoCubeOutline,
      color: 'bg-purple-500',
    },
    {
      title: 'Active Users',
      value: stats.users?.total || 0,
      subtitle: `${stats.users?.active_this_week || 0} active this week`,
      icon: IoPeopleOutline,
      color: 'bg-orange-500',
    },
    {
      title: 'Subscriptions',
      value: stats.subscriptions?.total || 0,
      subtitle: `${stats.subscriptions?.new_this_week || 0} new this week`,
      icon: IoMailOutline,
      color: 'bg-pink-500',
    },
    {
      title: 'Low Stock',
      value: stats.products?.low_stock || 0,
      subtitle: 'Products need attention',
      icon: IoAlertCircleOutline,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}
