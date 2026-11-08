import SalesBarChart from './SalesBarChart';
import SalesSummaryStats from './SalesSummaryStats';
import type { SalesChartProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Overview</h3>
      <SalesBarChart dailySales={data?.daily_sales || []} />
      <SalesSummaryStats
        totalSales={data?.total_sales || 0}
        totalOrders={data?.total_orders || 0}
        avgOrderValue={data?.avg_order_value || 0}
      />
    </div>
  );
}
