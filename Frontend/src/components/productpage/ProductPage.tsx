import { Link } from 'react-router-dom';
import { useProductDetails } from '../../hooks/catalog/useProductDetails';
import ProductDetailContent from './ProductDetailContent';
export default function ProductPage() {
  const { product, quantity, loading, error, added, handleQuantityChange, handleAddToBag } = useProductDetails();
  return <main className="max-w-6xl mx-auto px-4 pt-32 pb-12">
    <Link to="/home" className="underline">Back to store</Link>
    {loading && <p role="status">Loading product…</p>}
    {!loading && error && <p role="alert">{error}</p>}
    {!loading && !error && product && <ProductDetailContent product={product} quantity={quantity} added={added} onQuantityChange={handleQuantityChange} onSubmit={handleAddToBag} />}
  </main>;
}
