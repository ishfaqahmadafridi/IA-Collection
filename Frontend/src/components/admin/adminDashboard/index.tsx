import { useAdminDashboard } from '../../../hooks/admin/useAdminDashboard';
import StatsGrid from './StatsGrid';
import RecentOrdersSection from '../../admin/adminDashboard/RecentOrdersSection';
import QuickStatsRow from './QuickStatsRow';
import LoadingSpinner from './LoadingSpinner';

export default function AdminDashboard() {
  const { stats, recentOrders, loading, error, retry } = useAdminDashboard();
  if (loading || (!stats && !error)) {
    return <LoadingSpinner />;
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p role="alert" className="text-red-500 text-lg mb-4">
          {error || "No dashboard data available"}
        </p>
        <p className="text-gray-500 text-sm mb-4">Make sure you are logged in as an admin user</p>
        <button
          onClick={() => {
            void retry();
          }}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <StatsGrid stats={stats} />
      <RecentOrdersSection recent_Orders={recentOrders} />
      <QuickStatsRow stats={stats} />
    </div>
  );
}
