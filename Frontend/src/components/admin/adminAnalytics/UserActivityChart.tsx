import UserActivityBarChart from './UserActivityBarChart';
import ActivityBreakdown from './ActivityBreakdown';
import type { UserActivityChartProps } from '../../../types/components/admin/adminAnalytics/adminAnalyticsInterface';

export default function UserActivityChart({ data }: UserActivityChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">User Activity</h3>
      <UserActivityBarChart loginData={data?.daily_logins || []} />
      <ActivityBreakdown breakdown={data?.activity_breakdown || []} />
    </div>
  );
}
