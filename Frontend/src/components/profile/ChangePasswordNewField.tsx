import ProfileInput from './ProfileInput';
import { PROFILE_FIELDS } from '../../constants/profile';
import type { ProfileFieldProps } from '../../types/profile';
export default function ChangePasswordNewField(props: ProfileFieldProps) {
  return <ProfileInput config={PROFILE_FIELDS.newPassword} {...props} />;
}
