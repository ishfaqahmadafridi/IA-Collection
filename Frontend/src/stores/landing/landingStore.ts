import { create } from 'zustand';

interface LandingState {
  showButton: boolean;
  setShowButton: (show: boolean) => void;
}

export const useLandingStore = create<LandingState>((set) => ({
  showButton: false,
  setShowButton: (show) => set({ showButton: show }),
}));
