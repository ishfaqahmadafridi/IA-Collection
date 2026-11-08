import { useProfileStore } from '../../stores/profile/profileStore';
import { useAuthStore } from '../../stores/auth/authStore';

export default function ProfileHeader() {
    const profileData = useProfileStore((state) => state.profileData);
    const authUser = useAuthStore((state) => state.user);

    // Use profile data first, then auth user data as fallback
    const userName = profileData.name || profileData.username || authUser?.username || 'User';
    const userEmail = profileData.email || authUser?.email || 'user@example.com';
    const profileImage = profileData.profileImage;

    return (
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-4">
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={userName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">{userName}</h1>
                    <p className="text-rose-100 mt-1">{userEmail}</p>
                </div>
            </div>
        </div>
    );
}
