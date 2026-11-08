import type { ChangeEvent } from 'react';
import type { PasswordChange, ProfileUpdate } from './api';
export interface ProfileData extends ProfileUpdate { profileImage: string | null }
export interface PasswordFormValues extends PasswordChange { confirmPassword: string }
export interface ProfileContainerProps { activeTab: string; setActiveTab: (tab: string) => void }
export interface ProfileContentProps { activeTab: string }
export type ProfileTabsProps = ProfileContainerProps;
export interface ProfileImageDisplayProps { displayImage: string | null; userName: string }
export interface ProfileImageRemoveButtonProps { onRemove: () => void; show: boolean }
export interface ProfileImageSelectButtonProps { onSelect: (event: ChangeEvent<HTMLInputElement>) => void }
export interface ProfileImageUploadButtonProps { onUpload: () => void; isUploading: boolean; show: boolean }
export interface ProfileMessage { type: 'success' | 'error' | ''; text: string }
export interface ProfileMessageProps { message: ProfileMessage }
export interface ProfileFieldProps { value: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void }
export interface ProfileSubmitButtonProps { isLoading: boolean }
export interface ProfileInputConfig {
  id: string; name: string; label: string; type: 'text' | 'email' | 'password';
  autoComplete: string; required: boolean; maxLength?: number;
}
export interface ProfileInputProps extends ProfileFieldProps { config: ProfileInputConfig }
