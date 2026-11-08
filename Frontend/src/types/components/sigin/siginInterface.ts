import type { ChangeEvent, FormEvent, ReactNode } from 'react';

export interface SigninFormProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    handleSubmit: (e: FormEvent) => void;
    status: string;
    error: unknown;
}

export interface SigninInputFieldProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    icon: ReactNode;
}
