import type { CatBoyGCategory } from './catBoyGInterface';

type CategoryFilterState = {
    selectedCategory: string | null;
    selectedCategories: string[];
};

export function getDisplayCategories(
    categories: CatBoyGCategory[],
    { selectedCategory, selectedCategories }: CategoryFilterState
): CatBoyGCategory[] {
    if (selectedCategory) {
        return categories.filter((category) => category.id === selectedCategory);
    }

    if (selectedCategories.length > 0) {
        return categories.filter((category) => selectedCategories.includes(category.id));
    }

    return categories;
}
