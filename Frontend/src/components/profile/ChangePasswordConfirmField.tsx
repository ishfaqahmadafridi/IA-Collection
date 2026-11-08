import ProfileInput from './ProfileInput';
import { PROFILE_FIELDS } from '../../constants/profile';
import type { ProfileFieldProps } from '../../types/profile';
export default function ChangePasswordConfirmField(props: ProfileFieldProps) {
  return <ProfileInput config={PROFILE_FIELDS.confirmPassword} {...props} />;
}
