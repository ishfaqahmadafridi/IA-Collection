import { useEffect } from 'react';
import { activityService } from '../services/activityService';
export function usePageActivity(activity: string) {
  useEffect(() => {
    void activityService.log(activity).catch(error => console.error('Failed to log page view', error));
  }, [activity]);
}
