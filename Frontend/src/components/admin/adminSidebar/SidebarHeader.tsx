import type { SidebarHeaderProps } from '../../../types/components/admin/adminSidebar/adminSidebarInterface';

export default function SidebarHeader({ title = "Admin Panel", subtitle = "Management Dashboard" }: SidebarHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-800">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
