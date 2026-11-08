import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingStore } from '../../stores/landing/landingStore';
export default function EnterButton() {
    const navigate = useNavigate();
    const { showButton, setShowButton } = useLandingStore();

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 2000);
        return () => clearTimeout(timer);
    }, [setShowButton]);

    const handleEnter = useCallback(() => {
        localStorage.setItem('hasVisitedSite', 'true');
        navigate('/home');
    }, [navigate]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && showButton) {
                handleEnter();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showButton, handleEnter]);

    if (!showButton) return <div className="h-14" />;

    return (
        <button
            onClick={handleEnter}
            className="px-12 py-4 border border-white text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
        >
            Enter
        </button>
    );
}
