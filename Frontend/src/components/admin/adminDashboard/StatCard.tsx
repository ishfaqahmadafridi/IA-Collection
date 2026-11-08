import type { StatCardProps } from '../../../types/components/admin/adminDashboard/adminDashboardInterface';

export default function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-gray-400 text-xs">{subtitle}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
}
