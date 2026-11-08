import { create } from 'zustand';
import { carouselImages } from '../../assets/carouselData';

interface CarouselState {
  currentIndex: number;
  totalImages: number;
  setCurrentIndex: (index: number) => void;
}

export const useCarouselStore = create<CarouselState>((set) => ({
  currentIndex: 0,
  totalImages: carouselImages.length,
  setCurrentIndex: (index) => set({ currentIndex: index }),
}));
