import { useUiStore } from '../../../stores/admin/uiStore';
import { useAuthStore } from '../../../stores/auth/authStore';
import AdminSidebar from '../adminSidebar/index';
import AccessDenied from './AccessDenied';
import AdminHeader from './AdminHeader';
import AdminContent from './AdminContent';

export default function AdminPanel() {
  const { currentView } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  if (!initialized) return <p role="status" className="p-8">Checking access…</p>;
  const canAccess = user?.is_staff === true;

  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-w-0 md:ml-64 flex flex-col">
        <AdminHeader />
        <AdminContent currentView={currentView} />
      </div>
    </div>
  );
}
