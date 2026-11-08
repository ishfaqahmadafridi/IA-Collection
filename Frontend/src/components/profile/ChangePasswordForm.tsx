import { useChangePasswordForm } from '../../hooks/profile/useChangePasswordForm';
import ChangePasswordMessage from './ChangePasswordMessage';
import ChangePasswordCurrentField from './ChangePasswordCurrentField';
import ChangePasswordNewField from './ChangePasswordNewField';
import ChangePasswordConfirmField from './ChangePasswordConfirmField';
import ChangePasswordSubmitButton from './ChangePasswordSubmitButton';
export default function ChangePasswordForm() {
  const { passwords, handleChange, handleSubmit, isLoading, message } = useChangePasswordForm();
  return <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
    <ChangePasswordMessage message={message} />
    <ChangePasswordCurrentField value={passwords.currentPassword} onChange={handleChange} />
    <ChangePasswordNewField value={passwords.newPassword} onChange={handleChange} />
    <ChangePasswordConfirmField value={passwords.confirmPassword} onChange={handleChange} />
    <ChangePasswordSubmitButton isLoading={isLoading} />
  </form>;
}
