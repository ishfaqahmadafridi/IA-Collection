import { useEffect, useState } from 'react';
import { ecommerceService } from '../../api/ecommerceService';
import { errorMessage } from '../../utils/errors';
import type { ApiCategory } from '../../types/api';
export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    ecommerceService.getAllCategories().then(data => { if (active) setCategories(data); })
      .catch(error => { if (active) setError(errorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { categories, error, loading };
}
