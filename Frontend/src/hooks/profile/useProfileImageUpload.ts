import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useProfileStore } from '../../stores/profile/profileStore';
import { useAuthStore } from '../../stores/auth/authStore';
import { validateProfileImage } from '../../utils/profile/images';
export function useProfileImageUpload() {
  const profile = useProfileStore(state => state.profileData);
  const status = useProfileStore(state => state.imageStatus);
  const error = useProfileStore(state => state.imageError);
  const upload = useProfileStore(state => state.uploadProfileImage);
  const remove = useProfileStore(state => state.removeProfileImage);
  const user = useAuthStore(state => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  const busy = useRef(false);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected || busy.current) return;
    const message = validateProfileImage(selected);
    setValidationError(message);
    if (!message) setFile(selected);
  }
  async function handleImageUpload() {
    if (!file || busy.current) return;
    busy.current = true;
    try { await upload(file); setFile(null); }
    catch { /* Error is displayed from the store. */ }
    finally { busy.current = false; }
  }
  async function handleRemoveImage() {
    if (busy.current) return;
    busy.current = true;
    try { if (profile.profileImage) await remove(); setFile(null); }
    catch { /* Error is displayed from the store. */ }
    finally { busy.current = false; }
  }
  return {
    displayImage: preview || profile.profileImage,
    userName: profile.name || profile.username || user?.username || 'User',
    isUploading: status === 'loading', hasPreview: Boolean(preview), error: validationError || error,
    handleImageSelect, handleImageUpload, handleRemoveImage,
  };
}
