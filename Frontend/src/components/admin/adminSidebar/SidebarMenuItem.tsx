import type { SidebarMenuItemProps } from '../../../types/components/admin/adminSidebar/adminSidebarInterface';

export default function SidebarMenuItem({ id, label, icon: Icon, isActive, onClick }: SidebarMenuItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center px-4 py-3 mb-2 text-left transition-all duration-200 rounded-lg ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="text-xl mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
