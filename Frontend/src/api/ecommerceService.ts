import { getAllPages } from '../services/listing';
import api from './client';
import type { ApiCategory, ApiProduct } from '../types/api';
export const ecommerceService = {
  getAllCategories: () => getAllPages<ApiCategory>('/categories/'),
  getCategoryBySlug: (slug: string) => api.get<ApiCategory>(`/categories/${encodeURIComponent(slug)}/`),
  getParentCategories: () => getAllPages<ApiCategory>('/categories/parents/'),
  getSubcategories: (parent: number) => getAllPages<ApiCategory>('/categories/', { params: { parent } }),
  getCategoryProducts: (slug: string) => getAllPages<ApiProduct>(`/categories/${encodeURIComponent(slug)}/products/`),
  getAllProducts: () => getAllPages<ApiProduct>('/products/'),
  getProductById: (id: number) => api.get<ApiProduct>(`/products/${id}/`),
  getProductsByCategory: (category_slug: string) => getAllPages<ApiProduct>('/products/', { params: { category_slug } }),
  getProductsByCategoryId: (category: number) => getAllPages<ApiProduct>('/products/', { params: { category } }),
};
