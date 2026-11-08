import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';

import WomenCategoryGrid from './WomenCategoryGrid';

export default function WomenCategory() {
  const navigate = useNavigate();
  const setSelectedCategory = useUiStore((state) => state.setSelectedCategory);

  const handleViewAll = () => {
    setSelectedCategory(null);
    navigate('/women');
  };
  return (
    <div className="bg-background py-16 px-6">
      <div className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black uppercase tracking-tighter">
          Shop By Women Category
        </h2>
        <button
          onClick={handleViewAll}
          className="text-sm font-bold uppercase tracking-wider hover:underline"
        >
          View All
        </button>
      </div>
      <WomenCategoryGrid />
    </div>
  );
}
