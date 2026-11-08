import type { InventoryStatCardProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function InventoryStatCard({ label, value, color }: InventoryStatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <div>
          <p className="text-gray-500 text-xs">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
