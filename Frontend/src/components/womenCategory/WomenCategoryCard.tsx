import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import type { WomenCategoryCardProps } from '../../types/components/womenCategory/womenCategoryInterface';

export default function WomenCategoryCard({ category }: WomenCategoryCardProps) {
    const setSelectedCategory = useUiStore((state) => state.setSelectedCategory);
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedCategory(category.key);
        navigate('/women');
    };

    return (
        <div
            className="group relative h-[450px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-700"
            onClick={handleClick}
        >
            <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/90 via-transparent to-transparent flex items-end p-8">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{category.name}</h3>
                    <div className="w-10 h-1 bg-white group-hover:w-20 transition-all duration-500" />
                </div>
            </div>
        </div>
    );
}
