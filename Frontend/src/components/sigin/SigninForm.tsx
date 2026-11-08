import { useNavigate } from 'react-router-dom';
import type { SigninFormProps } from '../../types/components/sigin/siginInterface';
import SigninInputField from './SigninInputField';

export default function SigninForm({
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  status,
  error
}: SigninFormProps) {
  const navigate = useNavigate();

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {Boolean(error) && (
        <div role="alert" className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold text-center shadow-sm animate-shake">
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {String(error)}
          </span>
        </div>
      )}

      <SigninInputField
        label="Username"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />

      <SigninInputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:from-rose-600 hover:via-purple-600 hover:to-purple-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/50 active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Authenticating...
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button type="button"
            onClick={() => navigate('/register')}
            className="font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all"
          >
            Create one now
          </button>
        </p>
      </div>
    </form>
  );
}
