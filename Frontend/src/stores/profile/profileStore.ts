import { validateProfileImage, readImageDataUrl } from '../../utils/profile/images';
import type { ProfileData } from '../../types/profile';
import { create } from 'zustand';
import { accountService } from '../../services/accountService';
import { errorMessage } from '../../utils/errors';
import { registerSessionReset, sessionVersion } from '../../utils/session';
import type { PasswordChange, ProfileUpdate, User } from '../../types/api';
export type { ProfileData } from '../../types/profile';
type Status = 'idle' | 'loading' | 'succeeded' | 'failed';
interface ProfileState {
  profileData: ProfileData;
  updateStatus: Status; passwordStatus: Status; imageStatus: Status;
  updateError: string | null; passwordError: string | null; imageError: string | null;
  updateMessage: string; passwordMessage: string;
  clearUpdateMessage: () => void; clearPasswordMessage: () => void;
  updateLocalProfile: (data: Partial<ProfileData>) => void;
  removeProfileImage: () => Promise<void>;
  setProfileFromLogin: (user: User) => void;
  updateProfile: (data: ProfileUpdate) => Promise<User>;
  changePassword: (data: PasswordChange) => Promise<{ message: string }>;
  uploadProfileImage: (file: File) => Promise<{ image_url: string }>;
  fetchProfile: () => Promise<User>;
}
const initial = {
  profileData: { name: '', email: '', username: '', profileImage: null },
  updateStatus: 'idle', passwordStatus: 'idle', imageStatus: 'idle',
  updateError: null, passwordError: null, imageError: null, updateMessage: '', passwordMessage: '',
} as const;
export const useProfileStore = create<ProfileState>((set, get) => ({
  ...initial,
  clearUpdateMessage: () => set({ updateMessage: '', updateError: null, updateStatus: 'idle' }),
  clearPasswordMessage: () => set({ passwordMessage: '', passwordError: null, passwordStatus: 'idle' }),
  updateLocalProfile: data => set(state => ({ profileData: { ...state.profileData, ...data } })),
  setProfileFromLogin: user => set({ profileData: {
    name: user.name || user.username, username: user.username, email: user.email, profileImage: user.profile_image || null,
  } }),
  removeProfileImage: async () => {
    const version = sessionVersion();
    set({ imageStatus: 'loading', imageError: null });
    try {
      await accountService.removeImage();
      if (version === sessionVersion()) set(state => ({ imageStatus: 'succeeded', profileData: { ...state.profileData, profileImage: null } }));
    } catch (error) { set({ imageStatus: 'failed', imageError: errorMessage(error) }); throw error; }
  },
  updateProfile: async data => {
    const version = sessionVersion();
    set({ updateStatus: 'loading', updateError: null, updateMessage: '' });
    try {
      const user = await accountService.update(data);
      if (version === sessionVersion()) {
        get().setProfileFromLogin(user);
        set({ updateStatus: 'succeeded', updateMessage: 'Profile updated successfully.' });
      }
      return user;
    } catch (error) { set({ updateStatus: 'failed', updateError: errorMessage(error) }); throw error; }
  },
  changePassword: async data => {
    set({ passwordStatus: 'loading', passwordError: null, passwordMessage: '' });
    try {
      const response = await accountService.password(data);
      set({ passwordStatus: 'succeeded', passwordMessage: response.message });
      return response;
    } catch (error) { set({ passwordStatus: 'failed', passwordError: errorMessage(error), passwordMessage: errorMessage(error) }); throw error; }
  },
  uploadProfileImage: async file => {
    const version = sessionVersion();
    set({ imageStatus: 'loading', imageError: null });
    try {
      const validationError = validateProfileImage(file);
      if (validationError) throw new Error(validationError);
      const data = await readImageDataUrl(file);
      const response = await accountService.image(data);
      if (version === sessionVersion()) set(state => ({ imageStatus: 'succeeded', profileData: { ...state.profileData, profileImage: response.image_url } }));
      return response;
    } catch (error) { set({ imageStatus: 'failed', imageError: errorMessage(error) }); throw error; }
  },
  fetchProfile: async () => {
    const version = sessionVersion();
    const user = await accountService.profile();
    if (version === sessionVersion()) get().setProfileFromLogin(user);
    return user;
  },
}));
registerSessionReset(() => useProfileStore.setState(initial));
