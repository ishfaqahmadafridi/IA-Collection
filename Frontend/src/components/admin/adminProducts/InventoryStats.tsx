import InventoryStatCard from './InventoryStatCard';
import type { InventoryStatsProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function InventoryStats({ stats }: InventoryStatsProps) {
  const cards = [
    { label: 'Total Products', value: stats?.total_products || 0, color: 'bg-blue-500' },
    { label: 'In Stock', value: stats?.in_stock || 0, color: 'bg-green-500' },
    { label: 'Low Stock', value: stats?.low_stock || 0, color: 'bg-yellow-500' },
    { label: 'Out of Stock', value: stats?.out_of_stock || 0, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <InventoryStatCard key={index} {...card} />
      ))}
    </div>
  );
}
