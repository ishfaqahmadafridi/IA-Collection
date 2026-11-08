import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth/authStore';
import { useHeaderStore } from '../../stores/ui/headerStore';
import { DEFAULT_GREETING, GREETING_TIMING } from '../../constants/header';
export function useHeaderGreeting() {
  const user = useAuthStore(state => state.user);
  const authenticated = useAuthStore(state => state.isAuthenticated);
  const { fullText, displayText, isTyping, setDisplayText, setIsTyping, setFullText } = useHeaderStore();
  useEffect(() => {
    const greeting = authenticated && user ? `Welcome, ${user.username || user.name || 'User'}` : DEFAULT_GREETING;
    if (fullText !== greeting) setFullText(greeting);
  }, [authenticated, user, fullText, setFullText]);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isTyping && displayText.length < fullText.length) {
      timeout = setTimeout(() => setDisplayText(fullText.slice(0, displayText.length + 1)), GREETING_TIMING.type);
    } else if (isTyping) {
      timeout = setTimeout(() => setIsTyping(false), GREETING_TIMING.pause);
    } else if (displayText.length > 0) {
      timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), GREETING_TIMING.erase);
    } else {
      timeout = setTimeout(() => setIsTyping(true), GREETING_TIMING.restart);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isTyping, fullText, setDisplayText, setIsTyping]);
  return displayText;
}
