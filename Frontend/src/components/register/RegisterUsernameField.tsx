import type { RegisterFieldProps } from '../../types/components/register/registerInterface';
import RegisterInputField from './RegisterInputField';

export default function RegisterUsernameField({ onChange }: RegisterFieldProps) {
    return (
        <RegisterInputField
            label="Username"
            type="text"
            name="username"
            placeholder="Choose a username"
            onChange={onChange}
            icon={
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            }
        />
    );
}
