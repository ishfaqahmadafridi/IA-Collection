import { useUpdateProfileForm } from '../../hooks/profile/useUpdateProfileForm';
import UpdateProfileNameField from './UpdateProfileNameField';
import UpdateProfileUsernameField from './UpdateProfileUsernameField';
import UpdateProfileEmailField from './UpdateProfileEmailField';
import UpdateProfileSubmitButton from './UpdateProfileSubmitButton';
export default function UpdateProfileForm() {
  const { form, error, message, isLoading, handleChange, handleSubmit } = useUpdateProfileForm();
  return <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    <UpdateProfileNameField value={form.name} onChange={handleChange} />
    <UpdateProfileUsernameField value={form.username} onChange={handleChange} />
    <UpdateProfileEmailField value={form.email} onChange={handleChange} />
    <UpdateProfileSubmitButton isLoading={isLoading} />
  </form>;
}
