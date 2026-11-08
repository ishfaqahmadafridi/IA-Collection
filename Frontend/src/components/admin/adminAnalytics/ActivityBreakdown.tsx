import type { ActivityBreakdownProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function ActivityBreakdown({ breakdown }: ActivityBreakdownProps) {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  return (
    <div className="pt-4 border-t">
      <p className="text-sm text-gray-500 mb-3">Activity Breakdown</p>
      <div className="space-y-2">
        {breakdown.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
            <span className="text-sm text-gray-600 flex-1">{item.type}</span>
            <span className="text-sm font-medium text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
