import { useNavigate } from 'react-router-dom';
import { activityService } from '../../services/activityService';
import type { NavigationItem } from '../../types/navigation';
export function useStoreNavigation() {
  const navigate = useNavigate();
  return (item: NavigationItem) => {
    void activityService.log('view_category', { category: item.name, path: item.path })
      .catch(error => console.error('Failed to log category view', error));
    navigate(item.path);
  };
}
