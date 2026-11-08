import api from './client';
import type { ApiCategory, ApiProduct } from '../types/api';
export const ecommerceService = {
  getAllCategories: () => api.get<ApiCategory[]>('/categories/'),
  getCategoryBySlug: (slug: string) => api.get<ApiCategory>(`/categories/${encodeURIComponent(slug)}/`),
  getParentCategories: () => api.get<ApiCategory[]>('/categories/parents/'),
  getSubcategories: (parent: number) => api.get<ApiCategory[]>('/categories/', { params: { parent } }),
  getCategoryProducts: (slug: string) => api.get<ApiProduct[]>(`/categories/${encodeURIComponent(slug)}/products/`),
  getAllProducts: () => api.get<ApiProduct[]>('/products/'),
  getProductById: (id: number) => api.get<ApiProduct>(`/products/${id}/`),
  getProductsByCategory: (category_slug: string) => api.get<ApiProduct[]>('/products/', { params: { category_slug } }),
  getProductsByCategoryId: (category: number) => api.get<ApiProduct[]>('/products/', { params: { category } }),
};
