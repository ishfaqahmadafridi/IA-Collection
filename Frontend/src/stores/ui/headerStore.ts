import { create } from 'zustand';

interface HeaderState {
  fullText: string;
  displayText: string;
  isTyping: boolean;
  setDisplayText: (text: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  setFullText: (text: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  fullText: "Welcome to IA collection",
  displayText: "",
  isTyping: true,
  setDisplayText: (text) => set({ displayText: text }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setFullText: (text: string) => set({ fullText: text, displayText: "", isTyping: true }),
}));
