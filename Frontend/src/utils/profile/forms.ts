import { MIN_PASSWORD_LENGTH } from '../../constants/profile';
import type { PasswordFormValues, ProfileData, ProfileMessage } from '../../types/profile';
import type { ProfileUpdate } from '../../types/api';
export function validatePasswordForm(values: PasswordFormValues): string {
  if (values.newPassword !== values.confirmPassword) return 'New passwords do not match!';
  if (values.newPassword.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long!`;
  return '';
}
export function passwordFeedback(status: string, serverMessage: string, validationError: string): ProfileMessage {
  if (validationError || status === 'failed') return { type: 'error', text: validationError || serverMessage };
  if (status === 'succeeded') return { type: 'success', text: serverMessage };
  return { type: '', text: '' };
}
export function editableProfile(profile: ProfileData): ProfileUpdate {
  return { name: profile.name, username: profile.username, email: profile.email };
}
