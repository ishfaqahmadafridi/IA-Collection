import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
import { EMPTY_CREDENTIALS } from '../../constants/auth';
import { usePageActivity } from '../usePageActivity';
export function useSigninForm() {
  const navigate = useNavigate();
  const status = useAuthStore(state => state.status);
  const error = useAuthStore(state => state.error);
  const login = useAuthStore(state => state.loginUser);
  const [credentials, setCredentials] = useState({ ...EMPTY_CREDENTIALS });
  const submitting = useRef(false);
  usePageActivity('view_signin');
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    try { await login(credentials); navigate('/'); }
    catch { /* The store exposes the validation error. */ }
    finally { submitting.current = false; }
  }
  return {
    ...credentials, status, error, handleSubmit,
    setUsername: (username: string) => setCredentials(previous => ({ ...previous, username })),
    setPassword: (password: string) => setCredentials(previous => ({ ...previous, password })),
  };
}
