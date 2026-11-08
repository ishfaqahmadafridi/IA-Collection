import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from './admin/adminPanel';
import CartCheckoutBtn from './cart/CartCheckoutBtn';
import ChangePasswordForm from './profile/ChangePasswordForm';
import UpdateProfileForm from './profile/UpdateProfileForm';
import { useAuthStore } from '../stores/auth/authStore';
import { useCartStore } from '../stores/cart/cartStore';
import { useProfileStore } from '../stores/profile/profileStore';
import { orderService } from '../services/orderService';
import { accountService } from '../services/accountService';
import { clearSession } from '../utils/session';
import type { CustomerOrder } from '../types/api';
const user = { id: 1, username: 'customer', email: 'customer@example.com', is_staff: false };
beforeEach(() => { clearSession(); });
function mount(component: React.ReactNode) { return render(<MemoryRouter>{component}</MemoryRouter>); }
describe('frontend user flows', () => {
  it('denies the admin screen to authenticated customers', () => {
    useAuthStore.setState({ user, initialized: true, isAuthenticated: true });
    mount(<AdminPanel />);
    expect(screen.getByText(/access denied/i)).toBeTruthy();
  });
  it('waits for profile verification before showing admin content', () => {
    useAuthStore.setState({ initialized: false });
    mount(<AdminPanel />);
    expect(screen.getByRole('status').textContent).toContain('Checking access');
  });
  it('sends only product IDs, quantities and shipping data at checkout', async () => {
    useAuthStore.setState({ user, initialized: true, isAuthenticated: true });
    const key = crypto.randomUUID();
    useCartStore.setState({ checkoutKey: key, items: [{ id: 3, name: 'Shirt', size: '', quantity: 2, price: 1, totalPrice: 2 }] });
    const checkout = vi.spyOn(orderService, 'checkout').mockResolvedValue({ order_number: 'IA-order' } as CustomerOrder);
    mount(<CartCheckoutBtn />);
    fireEvent.change(screen.getByLabelText('Shipping address'), { target: { value: '123 Example Street, Lahore' } });
    const submittedKey = useCartStore.getState().checkoutKey;
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }));
    await waitFor(() => expect(checkout).toHaveBeenCalledWith({ checkout_key: submittedKey, shipping_address: '123 Example Street, Lahore', items: [{ product: 3, quantity: 2, size: '' }] }));
    await waitFor(() => expect(useCartStore.getState().items).toEqual([]));
  });
  it('keeps cart and checkout key after a failed order', async () => {
    useAuthStore.setState({ user, initialized: true, isAuthenticated: true });
    const key = crypto.randomUUID();
    useCartStore.setState({ checkoutKey: key, items: [{ id: 3, name: 'Shirt', size: '', quantity: 2, price: 1, totalPrice: 2 }] });
    vi.spyOn(orderService, 'checkout').mockRejectedValue(new Error('Insufficient stock'));
    mount(<CartCheckoutBtn />);
    fireEvent.change(screen.getByLabelText('Shipping address'), { target: { value: '123 Example Street, Lahore' } });
    const submittedKey = useCartStore.getState().checkoutKey;
    fireEvent.click(screen.getByRole('button', { name: 'Place order' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Insufficient stock');
    expect(useCartStore.getState().checkoutKey).toBe(submittedKey);
    expect(useCartStore.getState().items).toHaveLength(1);
  });
  it('submits password fields in the backend contract', async () => {
    const password = vi.spyOn(accountService, 'password').mockResolvedValue({ message: 'Changed' });
    mount(<ChangePasswordForm />);
    fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'OldPassword123!' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'NewPassword456!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'NewPassword456!' } });
    fireEvent.submit(screen.getByLabelText('Current Password').closest('form')!);
    await waitFor(() => expect(password).toHaveBeenCalledWith({ currentPassword: 'OldPassword123!', newPassword: 'NewPassword456!' }));
  });
  it('updates the displayed account from the server response', async () => {
    useProfileStore.getState().setProfileFromLogin(user);
    const update = vi.spyOn(accountService, 'update').mockResolvedValue({ ...user, name: 'Updated' });
    mount(<UpdateProfileForm />);
    fireEvent.change(screen.getByLabelText('name'), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
    await waitFor(() => expect(update).toHaveBeenCalledWith({ name: 'Updated', username: user.username, email: user.email }));
    await waitFor(() => expect(useAuthStore.getState().user?.name).toBe('Updated'));
  });
});
