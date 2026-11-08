import api from '../api/client';
import type { AxiosRequestConfig } from 'axios';
type ListResponse<T> = T[] | { results: T[]; next: string | null };
export async function getAllPages<T>(url: string, config?: AxiosRequestConfig): Promise<T[]> {
  const result: T[] = [];
  let page = 1;
  for (;;) {
    const data = await api.get<ListResponse<T>>(url, { ...config, params: { ...config?.params, page } });
    if (Array.isArray(data)) return [...result, ...data];
    result.push(...data.results);
    if (!data.next) return result;
    page += 1;
  }
}
