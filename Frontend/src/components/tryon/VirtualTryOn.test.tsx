import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import VirtualTryOn from './VirtualTryOn';
import { useDecartTryOn } from '../../hooks/tryon/useDecartTryOn';
import { useAuthStore } from '../../stores/auth/authStore';
import type { ApiProduct } from '../../types/api';
vi.mock('../../hooks/tryon/useDecartTryOn');
const product: ApiProduct = { id: 1, name: 'Test shirt', category: 1, category_name: 'Shirts', try_on_kind: 'top', price: 10, original_price: null, discount: 0, image: '/shirt.png', description: '', stock: 1, is_hot: false };
const start = vi.fn(), close = vi.fn(), useLocal = vi.fn();
function setup(available: boolean) {
  vi.mocked(useDecartTryOn).mockReturnValue({ outputRef: { current: null }, config: { available, model: 'lucy-vton-3.6', provider: 'Decart', session_seconds: 120, requires_sign_in: true, garment_image: product.image, prompt: 'Wear shirt' }, configError: '', phase: 'idle', status: 'Ready', error: '', active: false, start, stop: vi.fn() });
  return render(<MemoryRouter><VirtualTryOn product={product} onClose={close} onUseLocal={useLocal} /></MemoryRouter>);
}
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open'); } });
  useAuthStore.setState({ user: null, initialized: true, isAuthenticated: false });
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});
describe('live try-on start requirements', () => {
  it('returns to the free on-device preview', () => {
    setup(true);
    fireEvent.click(screen.getByRole('button', { name: 'Back to free on-device preview' }));
    expect(useLocal).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });
  it('explains unavailable configuration even after consent is checked', () => {
    setup(false);
    fireEvent.click(screen.getByRole('checkbox'));
    const button = screen.getByRole('button', { name: 'Live try-on unavailable' });
    expect(button).toHaveProperty('disabled', true);
    expect(screen.getByRole('status').textContent).toContain('Signing in or checking consent will not enable it');
    fireEvent.click(button);
    expect(start).not.toHaveBeenCalled();
  });
  it('provides a working sign-in action for guests when the service is enabled', () => {
    setup(true);
    const link = screen.getByRole('link', { name: 'Sign in to try on' });
    expect(link.getAttribute('href')).toBe('/signin');
    fireEvent.click(link);
    expect(close).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });
  it('enables start only after a signed-in user agrees to processing', () => {
    useAuthStore.setState({ user: { id: 1, username: 'test', email: 'test@example.com', is_staff: false }, isAuthenticated: true });
    setup(true);
    const button = screen.getByRole('button', { name: 'Start live try-on' });
    expect(button).toHaveProperty('disabled', true);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(button).toHaveProperty('disabled', false);
    fireEvent.click(button);
    expect(start).toHaveBeenCalledWith(true);
  });
});
