import { STOCK_BADGES } from '../../../constants/inventory';
import { stockStatus } from '../../../utils/admin/inventory';
import type { ProductStockBadgeProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';
export default function ProductStockBadge({ stock }: ProductStockBadgeProps) {
  const { text, className } = STOCK_BADGES[stockStatus(stock)];
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>{text}</span>;
}
