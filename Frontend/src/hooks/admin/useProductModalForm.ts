import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useProductsStore } from '../../stores/admin/productsStore';
import { errorMessage } from '../../utils/errors';
import { productFormValues, productWritePayload } from '../../utils/admin/productForm';
import type { ProductModalProps, ProductFormData } from '../../types/components/admin/productModal/productModalInterface';
export function useProductModalForm({ product, onClose }: ProductModalProps) {
  const { createProduct, updateProduct, fetchAllProducts, fetchInventoryStatus } = useProductsStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => productFormValues(product));
  const submitting = useRef(false);
  useEffect(() => { setFormData(productFormValues(product)); }, [product]);
  function setField<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setFormData(previous => ({ ...previous, [key]: value }));
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setError(''); setLoading(true);
    try {
      const payload = productWritePayload(formData);
      if (product) await updateProduct(String(product.id), payload);
      else await createProduct(payload);
      await fetchAllProducts();
      await fetchInventoryStatus();
      onClose();
    } catch (error) { setError(errorMessage(error)); }
    finally { submitting.current = false; setLoading(false); }
  }
  return { formData, setField, loading, error, handleSubmit };
}
