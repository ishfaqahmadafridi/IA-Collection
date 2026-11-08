import { Link } from 'react-router-dom';
import type { ProductPurchaseProps } from '../../types/product';
export default function ProductPurchaseForm({ stock, quantity, added, onQuantityChange, onSubmit }: ProductPurchaseProps) {
  return <>
    <form onSubmit={onSubmit} className="space-y-4">
      <label htmlFor="product-quantity" className="block">Quantity</label>
      <input id="product-quantity" type="number" min={1} max={stock} step={1} value={quantity} onChange={onQuantityChange} required className="border rounded p-3 bg-background" />
      <button disabled={stock <= 0} className="block bg-primary text-primary-foreground px-6 py-3 rounded disabled:opacity-50">Add to bag</button>
    </form>
    {added && <p role="status">Added to bag. <Link to="/cart" className="underline">View bag</Link></p>}
  </>;
}
