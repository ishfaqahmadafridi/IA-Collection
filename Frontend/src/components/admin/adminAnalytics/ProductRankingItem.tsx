import type { ProductRankingItemProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function ProductRankingItem({ product, rank }: ProductRankingItemProps) {
  const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-amber-600'];

  return (
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
        rankColors[rank - 1] || 'bg-gray-300'
      }`}>
        {rank}
      </div>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <p className="font-medium text-gray-900">{product.name}</p>
        <p className="text-sm text-gray-500">{product.total_sold} sold</p>
      </div>
      <p className="font-bold text-gray-900">PKR {product.total_revenue.toFixed(2)}</p>
    </div>
  );
}
