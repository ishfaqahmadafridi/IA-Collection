import { STORE_NAVIGATION } from '../../constants/navigation';
import { useStoreNavigation } from '../../hooks/header/useStoreNavigation';
export default function NavLinks() {
    const handleNavClick = useStoreNavigation();
    return (
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {STORE_NAVIGATION.map(item => (
                <button
                    key={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`px-3 py-2 text-[12px] font-black uppercase tracking-[0.2em] hover:opacity-50 transition-all duration-200 ${item.cls || ''}`}
                >
                    {item.name}
                </button>
            ))}
        </nav>
    );
}
