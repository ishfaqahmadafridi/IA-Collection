import { useCategories } from '../../../hooks/catalog/useCategories';
import type { CategoryStockInputsProps } from '../../../types/components/admin/productModal/productModalInterface';
export default function CategoryStockInputs({ category, stock, image, onCategoryChange, onStockChange, onImageChange }: CategoryStockInputsProps) {
  const { categories, error } = useCategories();
  return <div className="space-y-4">
    {error && <p role="alert">{error}</p>}
    <div><label htmlFor="admin-category" className="block">Category</label><select id="admin-category" required value={category} onChange={event => onCategoryChange(event.target.value)} className="w-full border rounded p-2"><option value="">Choose category</option>{categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
    <div><label htmlFor="admin-stock" className="block">Stock</label><input id="admin-stock" type="number" min={0} step={1} required value={stock} onChange={event => onStockChange(event.target.value)} className="w-full border rounded p-2" /></div>
    <div><label htmlFor="admin-image" className="block">Product image URL</label><input id="admin-image" type="url" value={image} onChange={event => onImageChange(event.target.value)} className="w-full border rounded p-2" /></div>
  </div>;
}
