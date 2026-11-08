import { AxiosError, AxiosHeaders, default as axios, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession } from '../utils/session';
// Install a transport adapter before loading the client; interceptors remain real.
const transport = vi.hoisted(() => vi.fn());
axios.defaults.adapter = transport;
const { default: api, ApiError } = await import('./client');
function response(config: InternalAxiosRequestConfig, data: unknown, status = 200) {
  return { config, data, status, statusText: String(status), headers: new AxiosHeaders() };
}
function reject(config: InternalAxiosRequestConfig, status: number, data: unknown) {
  return Promise.reject(new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, undefined, response(config, data, status)));
}
beforeEach(() => { clearSession(); transport.mockReset(); });
describe('API error and refresh handling', () => {
  it('retains field validation errors and a readable message', async () => {
    transport.mockImplementation(config => reject(config, 400, { email: ['Enter a valid email.'] }));
    const error = await api.post('/register/', {}).catch(error => error);
    expect(error).toBeInstanceOf(ApiError);
    if (!(error instanceof ApiError)) throw new Error('Expected API error');
    expect(error.message).toContain('email: Enter a valid email.');
    expect(error.fields).toEqual({ email: ['Enter a valid email.'] });
  });
  it('shares one refresh across simultaneous expired requests', async () => {
    localStorage.setItem('access_token', 'old'); localStorage.setItem('refresh_token', 'refresh');
    transport.mockImplementation(async config => {
      if (config.url?.endsWith('/login/refresh/')) {
        await new Promise(resolve => setTimeout(resolve, 5));
        return response(config, { access: 'new' });
      }
      return config.headers.Authorization === 'Bearer new' ? response(config, { ok: true }) : reject(config, 401, { detail: 'Expired' });
    });
    expect(await Promise.all([api.get('/profile/'), api.get('/admin/products/')])).toEqual([{ ok: true }, { ok: true }]);
    expect(transport.mock.calls.filter(([config]) => config.url.endsWith('/login/refresh/'))).toHaveLength(1);
  });
  it('clears credentials after an invalid refresh', async () => {
    localStorage.setItem('access_token', 'old'); localStorage.setItem('refresh_token', 'invalid');
    transport.mockImplementation(config => reject(config, 401, { detail: 'Invalid token' }));
    await expect(api.get('/profile/')).rejects.toThrow();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
  it('keeps credentials when refresh fails due to a network outage', async () => {
    localStorage.setItem('access_token', 'old'); localStorage.setItem('refresh_token', 'valid');
    transport.mockImplementation(config => config.url.endsWith('/login/refresh/') ? Promise.reject(new AxiosError('Network unavailable')) : reject(config, 401, {}));
    await expect(api.get('/profile/')).rejects.toThrow();
    expect(localStorage.getItem('refresh_token')).toBe('valid');
  });
});
