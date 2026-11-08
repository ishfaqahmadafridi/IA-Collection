import type { ProfileSubmitButtonProps } from '../../types/profile';

export default function ChangePasswordSubmitButton({ isLoading }: ProfileSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-rose-600 text-white font-bold uppercase tracking-wider rounded-xl hover:from-purple-600 hover:via-rose-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
    );
}
