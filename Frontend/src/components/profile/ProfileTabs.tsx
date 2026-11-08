import type { ProfileTabsProps } from '../../types/profile';
import ProfileTabIndicator from './ProfileTabIndicator';

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
    return (
        <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 font-semibold transition-colors relative ${
                    activeTab === 'profile' ? 'text-rose-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                Account Info
                {activeTab === 'profile' && <ProfileTabIndicator />}
            </button>
            <button
                onClick={() => setActiveTab('password')}
                className={`pb-3 px-4 font-semibold transition-colors relative ${
                    activeTab === 'password' ? 'text-rose-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                Change Password
                {activeTab === 'password' && <ProfileTabIndicator />}
            </button>
        </div>
    );
}
