import AdminDashboard from '../../admin/adminDashboard/index';
import AdminProducts from '../adminProducts/index';
import AdminOrders from '../adminOrders/index';
import AdminAnalytics from '../adminAnalytics/index';
import type { AdminContentProps } from '../../../types/components/admin/adminPanel/adminPanelInterface';

export default function AdminContent({ currentView }: AdminContentProps) {
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <main className="p-8 pt-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
}
