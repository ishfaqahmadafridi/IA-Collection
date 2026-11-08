import { useEffect, useState } from 'react';
import { ecommerceService } from '../api/ecommerceService';
import { errorMessage } from '../utils/errors';
import type { ApiCategory, ApiProduct } from '../types/api';
type CatalogData = { products: ApiProduct[]; categories: ApiCategory[] };
let inFlight: Promise<[ApiProduct[], ApiCategory[]]> | null = null;
function loadCatalog() {
  inFlight ??= Promise.all([ecommerceService.getAllProducts(), ecommerceService.getAllCategories()])
    .finally(() => { inFlight = null; });
  return inFlight;
}
export function useCatalog() {
  const [data, setData] = useState<CatalogData>({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    loadCatalog()
      .then(([products, categories]) => { if (active) setData({ products, categories }); })
      .catch(error => { if (active) setError(errorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return { ...data, loading, error, retry: () => setAttempt(value => value + 1) };
}
