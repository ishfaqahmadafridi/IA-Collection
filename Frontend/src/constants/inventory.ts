export const STOCK_BADGES = {
  out_of_stock: { text: 'Out of Stock', className: 'bg-red-100 text-red-800' },
  low_stock: { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' },
  in_stock: { text: 'In Stock', className: 'bg-green-100 text-green-800' },
};
export const INVENTORY_FILTERS = [
  { value: 'all', label: 'All Products' }, { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' }, { value: 'out_of_stock', label: 'Out of Stock' },
];
