import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useProfileStore } from '../../stores/profile/profileStore';
import { EMPTY_PASSWORD_FORM, PROFILE_FEEDBACK_DURATION_MS } from '../../constants/profile';
import { passwordFeedback, validatePasswordForm } from '../../utils/profile/forms';
import type { PasswordFormValues } from '../../types/profile';
export function useChangePasswordForm() {
  const status = useProfileStore(state => state.passwordStatus);
  const serverMessage = useProfileStore(state => state.passwordMessage);
  const clearMessage = useProfileStore(state => state.clearPasswordMessage);
  const changePassword = useProfileStore(state => state.changePassword);
  const [passwords, setPasswords] = useState<PasswordFormValues>({ ...EMPTY_PASSWORD_FORM });
  const [validationError, setValidationError] = useState('');
  const submitting = useRef(false);
  useEffect(() => {
    if (!serverMessage) return;
    const timer = setTimeout(clearMessage, PROFILE_FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [serverMessage, clearMessage]);
  useEffect(() => {
    if (status === 'succeeded') setPasswords({ ...EMPTY_PASSWORD_FORM });
  }, [status]);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setPasswords(previous => ({ ...previous, [name]: value }));
    setValidationError('');
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || status === 'loading') return;
    const error = validatePasswordForm(passwords);
    setValidationError(error);
    if (error) return;
    submitting.current = true;
    try { await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }); }
    catch { /* Server validation is exposed by the store. */ }
    finally { submitting.current = false; }
  }
  return { passwords, handleChange, handleSubmit, isLoading: status === 'loading', message: passwordFeedback(status, serverMessage, validationError) };
}
