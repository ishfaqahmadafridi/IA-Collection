import { IoGridOutline, IoCubeOutline, IoCartOutline, IoStatsChartOutline } from 'react-icons/io5';
import type { SidebarNavProps } from '../../../types/components/admin/adminSidebar/adminSidebarInterface';
import SidebarMenuItem from './SidebarMenuItem';

export default function SidebarNav({ currentView, onNavigate }: SidebarNavProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IoGridOutline },
    { id: 'products', label: 'Products', icon: IoCubeOutline },
    { id: 'orders', label: 'Orders', icon: IoCartOutline },
    { id: 'analytics', label: 'Analytics', icon: IoStatsChartOutline },
  ];

  return (
    <nav className="py-4 px-3">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.id}
          id={item.id}
          label={item.label}
          icon={item.icon}
          isActive={currentView === item.id}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
}
