import type { ProfileContentProps } from '../../types/profile';
import UpdateProfileForm from './UpdateProfileForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function ProfileContent({ activeTab }: ProfileContentProps) {
    return (
        <div className="mt-6">
            {activeTab === 'profile' ? <UpdateProfileForm /> : <ChangePasswordForm />}
        </div>
    );
}
