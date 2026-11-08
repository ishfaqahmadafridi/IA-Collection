import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import { useCartStore } from '../../stores/cart/cartStore';

import { activityService } from '../../services/activityService';

export default function HeaderIcons() {
    const navigate = useNavigate();
    const openSearch = useUiStore(state => state.setSearchDialogOpen);

    // Zustand selectors
    const cartItems = useCartStore((state) => state.items);
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleCartClick = () => {
        // Log activity to backend
        activityService.log('view_cart')
           .catch(err => console.error('Failed to log view_cart activity', err));
        navigate('/cart');
    };

    return (
        <div className="flex items-center gap-2 md:gap-4 text-2xl md:text-3xl">
            <button aria-label="Search products" onClick={() => openSearch(true)} className="p-2 hover:opacity-50 transition-opacity">
                <IoSearchOutline />
            </button>
            <button aria-label="Shopping bag" onClick={handleCartClick} className="p-2 hover:opacity-50 transition-opacity relative">
                <IoCartOutline />
                {count > 0 && (
                    <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black transform translate-x-1 -translate-y-1">
                        {count}
                    </span>
                )}
            </button>
        </div>
    );
}
