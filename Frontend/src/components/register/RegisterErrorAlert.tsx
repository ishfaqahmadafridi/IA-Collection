import { errorMessage } from '../../utils/errors';
import type { RegisterErrorAlertProps } from '../../types/components/register/registerInterface';

export default function RegisterErrorAlert({ error }: RegisterErrorAlertProps) {
    if (!error) return null;

    return (
        <div role="alert" className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-sm animate-shake">
            <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage(error)}
            </span>
        </div>
    );
}
