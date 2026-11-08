import type { RegisterSubmitButtonProps } from '../../types/components/register/registerInterface';

export default function RegisterSubmitButton({ status }: RegisterSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-rose-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:from-purple-600 hover:via-rose-600 hover:to-rose-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/50 active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
        >
            {status === 'loading' ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                </span>
            ) : (
                'Create Account'
            )}
        </button>
    );
}
