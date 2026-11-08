import { Link } from 'react-router-dom';
import { isDiscounted } from '../../utils/catalog';
import type { CatalogProductProps } from '../../types/catalog';
export default function CatalogProductCard({ product }: CatalogProductProps) {
  return <Link to={`/product/${product.id}`} className="block rounded-xl border border-border overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600">
    {product.image ? <img src={product.image} alt={product.name} loading="lazy" className="w-full aspect-[3/4] object-cover" /> : <div className="aspect-[3/4] bg-muted flex items-center justify-center">Image unavailable</div>}
    <div className="p-4 space-y-2">
      <h3 className="font-semibold">{product.name}</h3>
      <p>PKR {Number(product.price).toLocaleString()}</p>
      {isDiscounted(product) && <p className="line-through text-sm text-muted-foreground">PKR {Number(product.original_price).toLocaleString()}</p>}
      {product.stock <= 0 && <p className="text-sm">Out of stock</p>}
    </div>
  </Link>;
}
