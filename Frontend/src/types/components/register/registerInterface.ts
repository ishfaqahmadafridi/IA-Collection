import type { ChangeEvent, ReactNode } from 'react';

export interface RegisterFieldProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface RegisterInputFieldProps {
    label: string;
    type: string;
    name: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    icon: ReactNode;
    required?: boolean;
}

export interface RegisterErrorAlertProps {
    error: unknown;
}

export interface RegisterSubmitButtonProps {
    status: string;
}
