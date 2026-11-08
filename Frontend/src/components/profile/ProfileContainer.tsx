import type { ProfileContainerProps } from '../../types/profile';
import ProfileHeader from './ProfileHeader';
import ProfileImageUpload from './ProfileImageUpload';
import ProfileTabs from './ProfileTabs';
import ProfileContent from './ProfileContent';

export default function ProfileContainer({ activeTab, setActiveTab }: ProfileContainerProps) {
    return (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden transition-colors duration-500">
            <ProfileHeader />
            <div className="p-8">
                <div className="mb-8 pb-8 border-b border-border">
                    <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
                    <ProfileImageUpload />
                </div>
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <ProfileContent activeTab={activeTab} />
            </div>
        </div>
    );
}
