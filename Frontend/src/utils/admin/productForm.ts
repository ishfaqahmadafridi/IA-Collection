import type { Product, ProductFormData } from '../../types/components/admin/productModal/productModalInterface';
import type { ProductWrite } from '../../services/adminService';
export function productFormValues(product: Product | null): ProductFormData {
  return {
    name: product?.name || '', description: product?.description || '',
    price: product ? String(product.price) : '',
    original_price: product?.original_price == null ? '' : String(product.original_price),
    category: product ? String(product.category) : '', stock: product ? String(product.stock) : '',
    image: product?.image || '', is_hot: product?.is_hot || false,
  };
}
export function productWritePayload(form: ProductFormData): ProductWrite {
  return {
    ...form, price: Number(form.price), original_price: form.original_price ? Number(form.original_price) : null,
    stock: Number(form.stock), category: form.category ? Number(form.category) : null,
  };
}
