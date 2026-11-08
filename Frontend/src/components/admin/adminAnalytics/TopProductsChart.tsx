import ProductRankingItem from './ProductRankingItem';
import type { TopProductsChartProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function TopProductsChart({ products }: TopProductsChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <ProductRankingItem key={product.id} product={product} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
