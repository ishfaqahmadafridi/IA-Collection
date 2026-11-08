import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import HeaderIcons from './HeaderIcons';
import MobileNavigation from './MobileNavigation';
export default function LogoNav() {
  return <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3">
    <Link to="/home" className="text-2xl md:text-3xl font-black tracking-tighter whitespace-nowrap">AFRIDI’S</Link>
    <NavLinks />
    <MobileNavigation />
    <HeaderIcons />
  </div>;
}
