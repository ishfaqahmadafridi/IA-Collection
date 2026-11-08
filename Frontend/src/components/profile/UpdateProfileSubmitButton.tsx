import type { ProfileSubmitButtonProps } from '../../types/profile';

export default function UpdateProfileSubmitButton({ isLoading }: ProfileSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-xl hover:from-rose-600 hover:via-purple-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            {isLoading ? 'Saving…' : 'Save profile'}
        </button>
    );
}
