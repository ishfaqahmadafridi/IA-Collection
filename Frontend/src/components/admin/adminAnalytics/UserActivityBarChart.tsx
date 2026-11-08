import type { UserActivityBarChartProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function UserActivityBarChart({ loginData }: UserActivityBarChartProps) {
  const maxLogins = Math.max(...loginData.map((d) => d.count), 1);

  return (
    <div className="h-48 flex items-end gap-2 mb-4">
      {loginData.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-green-500 rounded-t-sm transition-all hover:bg-green-600"
            style={{ height: `${(day.count / maxLogins) * 100}%`, minHeight: '4px' }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        </div>
      ))}
    </div>
  );
}
