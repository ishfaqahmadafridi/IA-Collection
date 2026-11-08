import { useEffect, useState } from 'react';
import { useProductsStore } from '../../stores/admin/productsStore';
import type { Product } from '../../types/components/admin/adminProducts/adminProductsInterface';
export function useAdminProducts() {
  const products = useProductsStore(state => state.products);
  const stats = useProductsStore(state => state.inventoryStatus);
  const loading = useProductsStore(state => state.productsLoading);
  const error = useProductsStore(state => state.productsError);
  const fetchAllProducts = useProductsStore(state => state.fetchAllProducts);
  const fetchInventoryStatus = useProductsStore(state => state.fetchInventoryStatus);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  useEffect(() => { void fetchAllProducts(); void fetchInventoryStatus(); }, [fetchAllProducts, fetchInventoryStatus]);
  function retry() { void fetchAllProducts(); void fetchInventoryStatus(); }
  function addProduct() { setSelectedProductId(null); setShowModal(true); }
  function editProduct(product: Product) { setSelectedProductId(product.id); setShowModal(true); }
  function closeModal() { setShowModal(false); setSelectedProductId(null); }
  const selectedProduct = products.find(product => product.id === selectedProductId) || null;
  return { products, stats, loading, error, activeFilter, setActiveFilter, showModal, selectedProduct, retry, addProduct, editProduct, closeModal };
}
