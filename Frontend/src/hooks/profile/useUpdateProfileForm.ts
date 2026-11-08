import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useProfileStore } from '../../stores/profile/profileStore';
import { useAuthStore } from '../../stores/auth/authStore';
import { editableProfile } from '../../utils/profile/forms';
import { sessionVersion } from '../../utils/session';
export function useUpdateProfileForm() {
  const profile = useProfileStore(state => state.profileData);
  const status = useProfileStore(state => state.updateStatus);
  const error = useProfileStore(state => state.updateError);
  const message = useProfileStore(state => state.updateMessage);
  const update = useProfileStore(state => state.updateProfile);
  const [form, setForm] = useState(() => editableProfile(profile));
  const submitting = useRef(false);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || status === 'loading') return;
    const version = sessionVersion();
    submitting.current = true;
    try {
      const user = await update(form);
      if (version === sessionVersion()) useAuthStore.setState({ user });
    } catch { /* The form renders the store's validation error. */ }
    finally { submitting.current = false; }
  }
  return { form, error, message, isLoading: status === 'loading', handleChange, handleSubmit };
}
