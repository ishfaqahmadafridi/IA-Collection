import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TryOnButton from './TryOnButton';
import { liveTryOnService } from '../../services/liveTryOnService';
import type { ApiProduct } from '../../types/api';
import type { LiveTryOnConfig } from '../../types/liveTryon';
vi.mock('../../services/liveTryOnService', () => ({ liveTryOnService: { config: vi.fn() } }));
const product: ApiProduct = { id: 1, name: 'Shirt Dress', category: 1, category_name: 'Shirts', try_on_kind: 'top', price: 10, original_price: null, discount: 0, image: '/shirt.png', description: '', stock: 1, is_hot: false };
const config = (available: boolean) => ({ available, model: 'lucy-vton-3.6', provider: 'Decart', session_seconds: 120, requires_sign_in: true, garment_image: product.image, prompt: '' }) satisfies LiveTryOnConfig;
const renderButton = (value: ApiProduct) => render(<MemoryRouter><TryOnButton product={value} /></MemoryRouter>);
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute('open'); } });
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});
describe('try-on entry point', () => {
  it('uses the category, not the product name, to decide support', () => {
    renderButton({ ...product, try_on_kind: '' });
    expect(screen.queryByRole('button', { name: 'Try it on with your camera' })).toBeNull();
  });
  it('opens the free on-device preview and hides the paid option when unavailable', async () => {
    vi.mocked(liveTryOnService.config).mockResolvedValue(config(false));
    renderButton(product);
    fireEvent.click(screen.getByRole('button', { name: 'Try it on with your camera' }));
    expect(screen.getByRole('heading', { name: 'On-device camera preview' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start camera' })).toHaveProperty('disabled', false);
    await waitFor(() => expect(liveTryOnService.config).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: 'Try realistic live preview' })).toBeNull();
  });
  it('offers the live preview only when the store enabled it', async () => {
    vi.mocked(liveTryOnService.config).mockResolvedValue(config(true));
    renderButton(product);
    fireEvent.click(screen.getByRole('button', { name: 'Try it on with your camera' }));
    expect(await screen.findByRole('button', { name: 'Try realistic live preview' })).toBeTruthy();
  });
});
