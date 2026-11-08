import { describe, expect, it } from 'vitest';
import { validatePasswordForm, passwordFeedback } from './forms';
import { validateProfileImage } from './images';
import { MAX_PROFILE_IMAGE_BYTES } from '../../constants/limits';
describe('profile validation', () => {
  it('rejects mismatched passwords', () => {
    expect(validatePasswordForm({ currentPassword: 'old', newPassword: 'long-password', confirmPassword: 'different' })).toContain('do not match');
  });
  it('enforces minimum length even when the confirmation matches', () => {
    expect(validatePasswordForm({ currentPassword: 'old', newPassword: 'short', confirmPassword: 'short' })).toContain('at least 8');
  });
  it('leaves password policy beyond basic validation to the server', () => {
    expect(validatePasswordForm({ currentPassword: 'old', newPassword: 'valid-password', confirmPassword: 'valid-password' })).toBe('');
  });
  it('does not display success while local validation fails', () => {
    expect(passwordFeedback('succeeded', 'Changed', 'Mismatch')).toEqual({ type: 'error', text: 'Mismatch' });
  });
  it('rejects non-image files before creating a preview', () => {
    expect(validateProfileImage(new File(['text'], 'file.txt', { type: 'text/plain' }))).not.toBe('');
  });
  it('rejects oversized images before reading them', () => {
    const file = new File([new Uint8Array(MAX_PROFILE_IMAGE_BYTES + 1)], 'large.png', { type: 'image/png' });
    expect(validateProfileImage(file)).not.toBe('');
  });
});
