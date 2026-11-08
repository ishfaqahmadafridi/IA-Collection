import { create } from 'zustand';
import { accountService } from '../../services/accountService';
import { clearSession, registerSessionReset, sessionVersion } from '../../utils/session';
import { errorMessage } from '../../utils/errors';
import { useCartStore } from '../cart/cartStore';
import { useProfileStore } from '../profile/profileStore';
import type { Credentials, LoginResponse, Registration, User } from '../../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  logout: () => Promise<void>;
  registerUser: (data: Registration) => Promise<User>;
  loginUser: (credentials: Credentials) => Promise<LoginResponse>;
  fetchUserProfile: () => Promise<User | null>;
}
const initial = { user: null, isAuthenticated: false, initialized: false, status: 'idle', error: null } as const;
export const useAuthStore = create<AuthState>((set, get) => ({
  ...initial,
  logout: async () => { clearSession(); },
  registerUser: async data => {
    set({ status: 'loading', error: null });
    try {
      const user = await accountService.register(data);
      set({ status: 'succeeded' });
      return user;
    } catch (error) { set({ status: 'failed', error: errorMessage(error) }); throw error; }
  },
  loginUser: async credentials => {
    const guestItems = !get().isAuthenticated && !localStorage.getItem('access_token') ? useCartStore.getState().items : [];
    clearSession();
    if (guestItems.length) useCartStore.setState({ items: guestItems });
    const version = sessionVersion();
    set({ status: 'loading', error: null });
    try {
      const response = await accountService.login(credentials);
      if (version !== sessionVersion()) throw new Error('Session changed. Please sign in again.');
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      useProfileStore.getState().setProfileFromLogin(response.user);
      set({ user: response.user, isAuthenticated: true, initialized: true, status: 'succeeded' });
      return response;
    } catch (error) { set({ status: 'failed', error: errorMessage(error) }); throw error; }
  },
  fetchUserProfile: async () => {
    if (!localStorage.getItem('access_token')) {
      set({ initialized: true, user: null, isAuthenticated: false });
      return null;
    }
    if (get().status === 'loading') return null;
    const version = sessionVersion();
    set({ status: 'loading', error: null });
    try {
      const user = await accountService.profile();
      if (version !== sessionVersion()) return null;
      useProfileStore.getState().setProfileFromLogin(user);
      set({ user, isAuthenticated: true, initialized: true, status: 'succeeded' });
      return user;
    } catch (error) {
      if (version === sessionVersion()) set({ initialized: true, status: 'failed', error: errorMessage(error) });
      throw error;
    }
  },
}));
registerSessionReset(() => useAuthStore.setState({ ...initial, initialized: true }));
