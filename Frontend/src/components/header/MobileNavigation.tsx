import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
import { STORE_NAVIGATION } from '../../constants/navigation';
export default function MobileNavigation() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  return <details className="lg:hidden relative"><summary className="cursor-pointer p-2">Browse</summary>
    <nav aria-label="Mobile navigation" className="absolute top-full right-0 w-48 p-4 bg-background border border-border rounded shadow-lg space-y-3">
      {STORE_NAVIGATION.map(item => <Link key={item.path} to={item.path} onClick={event => event.currentTarget.closest('details')?.removeAttribute('open')} className="block">{item.name}</Link>)}
      <Link to="/tracking" className="block">Track order</Link>
      {user ? <>
        <Link to="/profile" className="block">My account</Link>
        {user.is_staff && <Link to="/admin" className="block">Admin panel</Link>}
        <button onClick={() => { void logout(); }} className="block">Logout</button>
      </> : <><Link to="/signin" className="block">Sign in</Link><Link to="/register" className="block">Register</Link></>}
    </nav>
  </details>;
}
