import { useProfilePage } from '../../hooks/profile/useProfilePage';
import ProfileBackButton from './ProfileBackButton';
import ProfileContainer from './ProfileContainer';

export default function UserProfile() {
    const { isAuthenticated, initialized, activeTab, setActiveTab } = useProfilePage();
    if (!initialized) return <p role="status" className="pt-32">Loading profile…</p>;
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">
                <ProfileBackButton />
                <ProfileContainer activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
}
