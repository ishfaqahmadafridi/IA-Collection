import type { SalesSummaryStatsProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function SalesSummaryStats({ totalSales, totalOrders, avgOrderValue }: SalesSummaryStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Sales</p>
        <p className="text-lg font-bold text-gray-900">${totalSales.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Orders</p>
        <p className="text-lg font-bold text-gray-900">{totalOrders}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Avg. Order</p>
        <p className="text-lg font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
      </div>
    </div>
  );
}
