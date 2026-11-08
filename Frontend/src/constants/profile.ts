import type { ProfileInputConfig, PasswordFormValues } from '../types/profile';
export const MIN_PASSWORD_LENGTH = 8;
export const PROFILE_FEEDBACK_DURATION_MS = 3000;
export const EMPTY_PASSWORD_FORM: PasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' };
export const PROFILE_FIELDS = {
  name: { id: 'profile-name', name: 'name', label: 'name', type: 'text', autoComplete: 'name', required: false, maxLength: 150 },
  username: { id: 'profile-username', name: 'username', label: 'username', type: 'text', autoComplete: 'username', required: true, maxLength: 150 },
  email: { id: 'profile-email', name: 'email', label: 'email', type: 'email', autoComplete: 'email', required: true, maxLength: 254 },
  currentPassword: { id: 'currentPassword', name: 'currentPassword', label: 'Current Password', type: 'password', autoComplete: 'current-password', required: true },
  newPassword: { id: 'newPassword', name: 'newPassword', label: 'New Password', type: 'password', autoComplete: 'new-password', required: true },
  confirmPassword: { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirm New Password', type: 'password', autoComplete: 'new-password', required: true },
} satisfies Record<string, ProfileInputConfig>;
