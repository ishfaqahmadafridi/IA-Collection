import { create } from 'zustand';
interface CategoryFilters {
  selectedSubCategory: string | null;
  setSelectedSubCategory: (category: string | null) => void;
}
export const useCategoryStore = create<CategoryFilters>(set => ({
  selectedSubCategory: null,
  setSelectedSubCategory: selectedSubCategory => set({ selectedSubCategory }),
}));
