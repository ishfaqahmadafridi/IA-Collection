import api from '../api/client';
export const activityService = {
  log: (activity_type: string, metadata: Record<string, unknown> = {}) => api.post<void>('/activity/log/', { activity_type, metadata }),
};
