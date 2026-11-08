import type { Product } from '../../types/components/productpage/productpageInterface';
import { create } from 'zustand';

// Check if user has visited before
const hasVisited = localStorage.getItem('hasVisitedSite') === 'true';

interface UiState {
  currentPage: string;
  previousPage: string;
  selectedProduct: Product | null;
  selectedCategory: string | null;
  selectedCategories: string[];
  theme: string;
  isMenuOpen: boolean;
  isSearchDialogOpen: boolean;

  setPage: (page: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleTheme: () => void;
  toggleMenu: () => void;
  setMenuOpen: (isOpen: boolean) => void;
  toggleSearchDialog: () => void;
  setSearchDialogOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentPage: hasVisited ? 'home' : 'landing',
  previousPage: hasVisited ? 'home' : 'landing',
  selectedProduct: null,
  selectedCategory: null,
  selectedCategories: [],
  theme: 'dark',
  isMenuOpen: false,
  isSearchDialogOpen: false,

  setPage: (page) => set((state) => ({ previousPage: state.currentPage, currentPage: page })),
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  setSelectedCategory: (category) => set({
    selectedCategory: category,
    selectedCategories: []
  }),

  setSelectedCategories: (categories) => set({
    selectedCategories: categories,
    selectedCategory: null
  }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),

  toggleSearchDialog: () => set((state) => ({ isSearchDialogOpen: !state.isSearchDialogOpen })),
  setSearchDialogOpen: (isOpen) => set({ isSearchDialogOpen: isOpen }),
}));
