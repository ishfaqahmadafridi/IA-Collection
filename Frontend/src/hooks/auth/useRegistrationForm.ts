import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
import { EMPTY_REGISTRATION } from '../../constants/auth';
export function useRegistrationForm() {
  const navigate = useNavigate();
  const status = useAuthStore(state => state.status);
  const error = useAuthStore(state => state.error);
  const register = useAuthStore(state => state.registerUser);
  const [form, setForm] = useState({ ...EMPTY_REGISTRATION });
  const submitting = useRef(false);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    try { await register(form); navigate('/signin'); }
    catch { /* The store exposes the validation error. */ }
    finally { submitting.current = false; }
  }
  return { status, error, handleChange, handleSubmit };
}
