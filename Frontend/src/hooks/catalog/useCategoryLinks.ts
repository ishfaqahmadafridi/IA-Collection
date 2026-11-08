import { useCatalog } from '../useCatalog';
export function useCategoryLinks(group: string) {
  const { categories, loading, error, retry } = useCatalog();
  const parent = categories.find(category => category.slug === group);
  const children = parent ? categories.filter(category => category.parent === parent.id) : [];
  return { children, loading, error, retry };
}
