import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../../stores/admin/uiStore';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import BackToStoreButton from './BackToStoreButton';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { currentView, setCurrentView } = useUiStore();

  const handleNavigation = (viewId: string) => {
    if (viewId === 'dashboard' || viewId === 'products' || viewId === 'orders' || viewId === 'analytics') setCurrentView(viewId);
  };

  const handleBackToStore = () => {
    navigate('/home');
  };

  return (
    <aside className="md:fixed left-0 top-0 md:h-screen w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-xl">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav currentView={currentView} onNavigate={handleNavigation} />
      </div>
      <BackToStoreButton onClick={handleBackToStore} />
    </aside>
  );
}
