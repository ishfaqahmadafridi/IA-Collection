import { useAdminProducts } from '../../../hooks/admin/useAdminProducts';
import ProductsHeader from './ProductsHeader';
import InventoryStats from './InventoryStats';
import ProductFilterTabs from './ProductFilterTabs';
import ProductsTable from './ProductsTable';
import LoadingSpinner from './LoadingSpinner';
import ProductModal from '../productModal';
export default function AdminProducts() {
  const { products, stats, loading, error, activeFilter, setActiveFilter, showModal, selectedProduct, retry, addProduct, editProduct, closeModal } = useAdminProducts();
  if (loading && !products.length && !showModal) return <LoadingSpinner />;
  if (error && !showModal) return <div role="alert" className="p-6 space-y-4"><p>Failed to load: {error}</p><button onClick={retry} className="underline">Retry</button></div>;
  return <div className="space-y-6 py-2">
    <ProductsHeader onAddProduct={addProduct} />
    <InventoryStats stats={stats} />
    <ProductFilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
    <ProductsTable products={products} activeFilter={activeFilter} onEditProduct={editProduct} />
    {showModal && <ProductModal product={selectedProduct} onClose={closeModal} />}
  </div>;
}
