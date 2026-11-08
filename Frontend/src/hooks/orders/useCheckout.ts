import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cart/cartStore';
import { useAuthStore } from '../../stores/auth/authStore';
import { orderService } from '../../services/orderService';
import { errorMessage } from '../../utils/errors';
import { sessionVersion } from '../../utils/session';
import { checkoutPayload } from '../../utils/orders';
export function useCheckout() {
  const items = useCartStore(state => state.items);
  const checkoutKey = useCartStore(state => state.checkoutKey);
  const address = useCartStore(state => state.shippingAddress);
  const setAddress = useCartStore(state => state.setShippingAddress);
  const authenticated = useAuthStore(state => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || !items.length) return;
    const version = sessionVersion();
    submitting.current = true;
    setLoading(true); setError('');
    try {
      const order = await orderService.checkout(checkoutPayload(checkoutKey, address, items));
      if (version !== sessionVersion()) return;
      if (useCartStore.getState().checkoutKey === checkoutKey) useCartStore.getState().clearCart();
      navigate(`/tracking?order=${encodeURIComponent(order.order_number)}`);
    } catch (error) { if (version === sessionVersion()) setError(errorMessage(error)); }
    finally { submitting.current = false; setLoading(false); }
  }
  return { hasItems: items.length > 0, authenticated, address, setAddress, loading, error, submit };
}
