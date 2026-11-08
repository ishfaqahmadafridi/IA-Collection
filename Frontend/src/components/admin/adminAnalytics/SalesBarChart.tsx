import type { SalesBarChartProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function SalesBarChart({ dailySales }: SalesBarChartProps) {
  const maxSale = Math.max(...dailySales.map((d) => d.total), 1);

  return (
    <div className="h-48 flex items-end gap-2 mb-4">
      {dailySales.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
            style={{ height: `${(day.total / maxSale) * 100}%`, minHeight: '4px' }}
          ></div>
          <span className="text-xs text-gray-500 mt-2">
            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
        </div>
      ))}
    </div>
  );
}
