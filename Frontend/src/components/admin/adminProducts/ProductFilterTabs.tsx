import { INVENTORY_FILTERS } from '../../../constants/inventory';
import type { ProductFilterTabsProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function ProductFilterTabs({ activeFilter, onFilterChange }: ProductFilterTabsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-wrap gap-2">
        {INVENTORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeFilter === filter.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
