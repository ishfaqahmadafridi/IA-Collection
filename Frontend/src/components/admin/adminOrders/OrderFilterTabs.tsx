import type { OrderFilterTabsProps, StatusOption } from '../../../types/components/admin/adminOrders/adminOrdersInterface';

export default function OrderFilterTabs({ activeFilter, onFilterChange }: OrderFilterTabsProps) {
  const statuses: StatusOption[] = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilterChange(status.value)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeFilter === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
