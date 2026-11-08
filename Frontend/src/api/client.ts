import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { clearSession, sessionVersion } from '../utils/session';

const baseURL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const http = axios.create({ baseURL, timeout: 15000 });
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _session?: number };
export class ApiError extends Error {
  constructor(message: string, public status?: number, public fields: unknown = null) {
    super(message);
    this.name = 'ApiError';
  }
}
function describe(data: unknown): string | undefined {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(describe).filter(Boolean).join(' ');
  if (data && typeof data === 'object') {
    return Object.entries(data).map(([key, value]) => {
      const message = describe(value);
      return ['detail', 'error', 'non_field_errors'].includes(key) ? message : `${key}: ${message}`;
    }).join(' ');
  }
}
let refreshing: Promise<string> | null = null;
http.interceptors.request.use((config: RetryConfig) => {
  config._session ??= sessionVersion();
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
http.interceptors.response.use(response => {
  const config = response.config as RetryConfig;
  if (config._session !== sessionVersion()) throw new ApiError('Session changed. Please try again.', 401);
  return response;
}, async (error: unknown) => {
  if (!axios.isAxiosError(error)) throw error;
  const config = error.config as RetryConfig | undefined;
  const isLogin = config?.url === '/login/' || config?.url === '/register/';
  if (error.response?.status === 401 && config && !config._retry && !isLogin) {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh && config._session === sessionVersion()) {
      config._retry = true;
      const version = sessionVersion();
      let access: string;
      try {
        refreshing ??= axios.post<{ access: string }>(`${baseURL}/login/refresh/`, { refresh }, { timeout: 15000 })
          .then(({ data }) => {
            if (version !== sessionVersion()) throw new ApiError('Session changed. Please sign in again.', 401);
            localStorage.setItem('access_token', data.access);
            return data.access;
          }).finally(() => { refreshing = null; });
        access = await refreshing;
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError) && [401, 403].includes(refreshError.response?.status ?? 0)
          && version === sessionVersion()) clearSession();
        throw new ApiError('Unable to renew your session. Please try again or sign in.', 401);
      }
      config.headers.Authorization = `Bearer ${access}`;
      return http(config);
    }
  }
  if (error.response?.status === 401 && !isLogin && config?._session === sessionVersion()) clearSession();
  throw new ApiError(describe(error.response?.data) || error.message, error.response?.status, error.response?.data);
});

// Axios interceptors retain Axios responses; this wrapper exposes typed response bodies.
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => (await http.get<T>(url, config)).data,
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => (await http.post<T>(url, data, config)).data,
  put: async <T>(url: string, data?: unknown): Promise<T> => (await http.put<T>(url, data)).data,
  patch: async <T>(url: string, data?: unknown): Promise<T> => (await http.patch<T>(url, data)).data,
  delete: async <T>(url: string): Promise<T> => (await http.delete<T>(url)).data,
};
export default api;
