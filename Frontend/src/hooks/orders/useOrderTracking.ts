import { useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
import { orderService } from '../../services/orderService';
import { errorMessage } from '../../utils/errors';
import { sessionVersion } from '../../utils/session';
import type { CustomerOrder } from '../../types/api';
export function useOrderTracking() {
  const [params] = useSearchParams();
  const [number, setNumber] = useState(params.get('order') || '');
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const authenticated = useAuthStore(state => state.isAuthenticated);
  const initialized = useAuthStore(state => state.initialized);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    const version = sessionVersion();
    submitting.current = true;
    setLoading(true); setError(''); setOrder(null);
    try { const result = await orderService.track(number); if (version === sessionVersion()) setOrder(result); }
    catch (error) { if (version === sessionVersion()) setError(errorMessage(error)); }
    finally { submitting.current = false; setLoading(false); }
  }
  return { number, setNumber, order, loading, error, authenticated, initialized, submit };
}
