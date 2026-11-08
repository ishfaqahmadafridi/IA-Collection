import RegisterBackground from './RegisterBackground';
import RegisterHeader from './RegisterHeader';
import RegisterFormContainer from './RegisterFormContainer';
import RegisterFooter from './RegisterFooter';
import { usePageActivity } from '../../hooks/usePageActivity';

export default function Register() {
    usePageActivity('view_signup');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-black pt-28 md:pt-32 px-4 pb-12 transition-colors duration-500">
            <div className="max-w-md w-full">
                <RegisterBackground />
                <div className="relative bg-background/90 dark:bg-black/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border-2 border-border transition-all duration-500">
                    <RegisterHeader />
                    <RegisterFormContainer />
                    <RegisterFooter />
                </div>
            </div>
        </div>
    );
}
