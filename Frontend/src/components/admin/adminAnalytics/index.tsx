import { useAdminAnalytics } from '../../../hooks/admin/useAdminAnalytics';
import AnalyticsHeader from './AnalyticsHeader';
import SalesChart from './SalesChart';
import UserActivityChart from './UserActivityChart';
import TopProductsChart from './TopProductsChart';
import LoadingSpinner from './LoadingSpinner';

export default function AdminAnalytics() {
  const { salesAnalytics, userAnalytics, topProducts, loading, error, retry } = useAdminAnalytics();
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) return <div role="alert" className="p-6 space-y-4"><p>{error}</p><button onClick={retry} className="underline">Try again</button></div>;
  return (
    <div className="space-y-6 py-2">
      <AnalyticsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesAnalytics} />
        <UserActivityChart data={userAnalytics} />
      </div>
      <TopProductsChart products={topProducts} />
    </div>
  );
}
