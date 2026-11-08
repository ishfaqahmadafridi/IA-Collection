import WelcomeText from './WelcomeText';
import EnterButton from './EnterButton';
import { usePageActivity } from '../../hooks/usePageActivity';
import ScrollReveal from '../layout/ScrollReveal';

export default function LandingPage() {
    usePageActivity('view_landing');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <ScrollReveal animation="fade-up">
                <WelcomeText />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={500}>
                <EnterButton />
            </ScrollReveal>
        </div>
    );
}
