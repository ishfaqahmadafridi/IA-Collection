import type { AdminHeaderProps } from '../../../types/components/admin/adminPanel/adminPanelInterface';

export default function AdminHeader({ title = "Admin Panel" }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-5">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
    </header>
  );
}
