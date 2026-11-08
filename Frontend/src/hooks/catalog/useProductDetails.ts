import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { ecommerceService } from '../../api/ecommerceService';
import { useCartStore } from '../../stores/cart/cartStore';
import { errorMessage } from '../../utils/errors';
import type { ApiProduct } from '../../types/api';
export function useProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setAdded(false); setQuantity(1); setProduct(null);
    if (!id || !/^\d+$/.test(id)) { setError('Product not found.'); setLoading(false); return; }
    ecommerceService.getProductById(Number(id)).then(data => { if (active) setProduct(data); })
      .catch(error => { if (active) setError(errorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    setQuantity(event.target.valueAsNumber);
    setAdded(false);
  }
  function handleAddToBag(event: FormEvent) {
    event.preventDefault();
    if (!product) return;
    try {
      addToCart({ id: product.id, name: product.name, price: Number(product.price), image: product.image, quantity, size: '' });
      setAdded(true);
    } catch (error) { setError(errorMessage(error)); }
  }
  return { product, quantity, loading, error, added, handleQuantityChange, handleAddToBag };
}
