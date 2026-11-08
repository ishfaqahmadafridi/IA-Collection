import { useSigninForm } from '../../hooks/auth/useSigninForm';
import SigninBackground from './SigninBackground';
import SigninHeader from './SigninHeader';
import SigninForm from './SigninForm';
export default function Signin() {
  const form = useSigninForm();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black pt-28 md:pt-32 px-4 pb-8 transition-colors duration-500">
      <div className="max-w-md w-full">
        <SigninBackground />

        <div className="relative bg-background/90 dark:bg-black/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-2 border-border transition-all duration-500">
          <SigninHeader />
          <SigninForm {...form} />
        </div>
      </div>
    </div>
  );
}
