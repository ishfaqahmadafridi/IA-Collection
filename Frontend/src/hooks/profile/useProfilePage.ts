import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
export function useProfilePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const initialized = useAuthStore(state => state.initialized);
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => {
    if (initialized && !isAuthenticated) navigate('/signin');
  }, [initialized, isAuthenticated, navigate]);
  return { isAuthenticated, initialized, activeTab, setActiveTab };
}
