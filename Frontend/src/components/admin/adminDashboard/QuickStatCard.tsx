import type { QuickStatCardProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function QuickStatCard({ title, value, gradient }: QuickStatCardProps) {
  return (
    <div className={`bg-linear-to-br ${gradient} rounded-xl shadow-sm p-6 text-white`}>
      <h4 className="text-sm font-medium opacity-90 mb-2">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
