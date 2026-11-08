import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth/authStore';
import { useUiStore } from '../../stores/ui/uiStore';
import { useHeaderGreeting } from '../../hooks/header/useHeaderGreeting';
import { useProfileStore } from '../../stores/profile/profileStore';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

export default function TopBar() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.is_staff || false;
    const logout = useAuthStore((state) => state.logout);
    const { theme, toggleTheme } = useUiStore();
    const displayText = useHeaderGreeting();

    const profileData = useProfileStore((state) => state.profileData);
    const profileImage = profileData.profileImage;

    return (
        <div className="bg-background py-2 border-b border-border hidden md:block transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70">
                <span className="min-w-[200px]">{displayText}<span className="animate-pulse">|</span></span>
                <div className="flex gap-6 items-center">
                    <button aria-label="Toggle color theme" onClick={toggleTheme} className="p-2 hover:opacity-50 transition-opacity text-lg">
                        {theme === 'light' ? <IoMoonOutline /> : <IoSunnyOutline className="text-yellow-400" />}
                    </button>


                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <button onClick={() => navigate('/admin')} className="hover:text-blue-600 transition-colors px-2 py-1">Admin Panel</button>
                            )}
                            <button onClick={logout} className="hover:text-rose-600 transition-colors px-2 py-1 flex items-center gap-1">
                                <span>Logout</span>
                                <span className="lowercase font-normal opacity-60">({user?.username})</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/signin')} className="hover:text-black dark:hover:text-white transition-colors px-2 py-1">Sign In</button>
                            <span className="opacity-30">|</span>
                            <button onClick={() => navigate('/register')} className="hover:text-black dark:hover:text-white transition-colors px-2 py-1">Register</button>
                        </div>
                    )}
                    <button onClick={() => navigate('/tracking')} className="hover:text-foreground transition-colors px-2 py-1">Tracking</button>

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate('/profile')}
                            className="hover:opacity-80 transition-opacity flex items-center group overflow-hidden rounded-full ml-2 shadow-sm"
                            title={profileData.username || 'Profile'}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={profileData.username}
                                    className="w-7 h-7 rounded-full object-cover border-2 border-rose-600"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-black uppercase border-2 border-rose-600">
                                    {(profileData.username || profileData.name || 'U').charAt(0)}
                                </div>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
