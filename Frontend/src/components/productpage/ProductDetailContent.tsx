import ProductPurchaseForm from './ProductPurchaseForm';
import type { ProductDetailContentProps } from '../../types/product';
export default function ProductDetailContent({ product, ...purchase }: ProductDetailContentProps) {
  return <div className="grid md:grid-cols-2 gap-8 mt-8">
    {product.image && <img src={product.image} alt={product.name} className="w-full rounded-xl" />}
    <div className="space-y-6">
      <h1 className="text-3xl">{product.name}</h1>
      <p>PKR {Number(product.price).toLocaleString()}</p>
      <p>{product.description}</p>
      <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      <ProductPurchaseForm stock={product.stock} {...purchase} />
    </div>
  </div>;
}
