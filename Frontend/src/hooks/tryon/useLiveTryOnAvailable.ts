import { useEffect, useState } from 'react';
import { liveTryOnService } from '../../services/liveTryOnService';
// The paid live service is optional; any failure simply hides it.
export function useLiveTryOnAvailable(productId: number): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setAvailable(false);
    liveTryOnService.config(productId, controller.signal)
      .then(config => { if (!controller.signal.aborted) setAvailable(config.available); })
      .catch(() => undefined);
    return () => controller.abort();
  }, [productId]);
  return available;
}
