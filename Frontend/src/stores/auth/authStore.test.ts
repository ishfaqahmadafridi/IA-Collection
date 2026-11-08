import { beforeEach, describe, expect, it, vi } from 'vitest';
import { accountService } from '../../services/accountService';
import { useAuthStore } from './authStore';
import { useProfileStore } from '../profile/profileStore';
import { useCartStore } from '../cart/cartStore';
import { useOrdersStore } from '../admin/ordersStore';
import { clearSession } from '../../utils/session';
import type { User } from '../../types/api';
const user: User = { id: 1, username: 'customer', email: 'a@example.com', is_staff: false };
beforeEach(() => { clearSession(); });
describe('verified sessions', () => {
  it('does not trust a locally stored token as verified authentication', async () => {
    localStorage.setItem('access_token', 'unverified');
    vi.spyOn(accountService, 'profile').mockRejectedValue(new Error('Unavailable'));
    await expect(useAuthStore.getState().fetchUserProfile()).rejects.toThrow('Unavailable');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
  it('clears profile, cart, tokens and admin data on logout', async () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('profile_image', 'old-image');
    useProfileStore.getState().setProfileFromLogin(user);
    useCartStore.setState({ items: [{ id: 1, name: 'Shirt', price: 100, quantity: 1, totalPrice: 100, size: '' }] });
    useOrdersStore.setState({ ordersError: 'private error' });
    await useAuthStore.getState().logout();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('profile_image')).toBeNull();
    expect(useProfileStore.getState().profileData.username).toBe('');
    expect(useCartStore.getState().items).toEqual([]);
    expect(useOrdersStore.getState().ordersError).toBeNull();
  });
  it('preserves a guest bag when signing in for checkout', async () => {
    useCartStore.setState({ items: [{ id: 1, name: 'Shirt', price: 100, quantity: 1, totalPrice: 100, size: '' }] });
    vi.spyOn(accountService, 'login').mockResolvedValue({ access: 'access', refresh: 'refresh', user });
    await useAuthStore.getState().loginUser({ username: 'customer', password: 'secret' });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
  it('ignores a profile response that arrives after logout', async () => {
    localStorage.setItem('access_token', 'token');
    let finish!: (user: User) => void;
    vi.spyOn(accountService, 'profile').mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const pending = useAuthStore.getState().fetchUserProfile();
    await useAuthStore.getState().logout();
    finish(user);
    await pending;
    expect(useAuthStore.getState().user).toBeNull();
    expect(useProfileStore.getState().profileData.username).toBe('');
  });
});
