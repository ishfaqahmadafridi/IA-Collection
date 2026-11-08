import { useId } from 'react';
import type { RegisterInputFieldProps } from '../../types/components/register/registerInterface';

export default function RegisterInputField({
    label,
    type,
    name,
    placeholder,
    onChange,
    icon,
    required = true
}: RegisterInputFieldProps) {
    const id = useId();
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">{label}</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-500">
                    {icon}
                </div>
                <input
          id={id}
          autoComplete={type === 'password' ? 'new-password' : type === 'email' ? 'email' : 'username'}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-4 bg-muted border-2 border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:bg-background rounded-xl outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground"
                    required={required}
                />
            </div>
        </div>
    );
}
