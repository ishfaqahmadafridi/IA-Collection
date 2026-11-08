import QuickStatCard from './QuickStatCard';
import type { QuickStatsRowProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function QuickStatsRow({ stats }: QuickStatsRowProps) {
  const quickStats = [
    {
      title: 'Weekly Revenue',
      value: `PKR ${stats.sales?.weekly?.toFixed(2) || 0}`,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Monthly Revenue',
      value: `PKR ${stats.sales?.monthly?.toFixed(2) || 0}`,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Weekly Orders',
      value: stats.orders?.weekly || 0,
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickStats.map((stat, index) => (
        <QuickStatCard key={index} {...stat} />
      ))}
    </div>
  );
}
