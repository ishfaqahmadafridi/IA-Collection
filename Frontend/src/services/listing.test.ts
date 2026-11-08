import { describe, expect, it, vi } from 'vitest';
import api from '../api/client';
import { getAllPages } from './listing';
describe('paginated list compatibility', () => {
  it('collects every page while preserving query filters', async () => {
    const get = vi.spyOn(api, 'get').mockResolvedValueOnce({ results: [{ id: 1 }], next: 'https://server/api/products/?page=2' })
      .mockResolvedValueOnce({ results: [{ id: 2 }], next: null });
    expect(await getAllPages('/products/', { params: { category: 3 } })).toEqual([{ id: 1 }, { id: 2 }]);
    expect(get).toHaveBeenNthCalledWith(2, '/products/', { params: { category: 3, page: 2 } });
  });
  it('supports existing array responses', async () => {
    vi.spyOn(api, 'get').mockResolvedValue([{ id: 1 }]);
    expect(await getAllPages('/products/')).toEqual([{ id: 1 }]);
  });
});
