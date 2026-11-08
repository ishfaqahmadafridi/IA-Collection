export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  is_staff: boolean;
  profile_image?: string;
}
export interface Credentials { username: string; password: string }
export interface Registration extends Credentials { email: string }
export interface LoginResponse { access: string; refresh: string; user: User }
export interface ProfileUpdate { name: string; username: string; email: string }
export interface PasswordChange { currentPassword: string; newPassword: string }
export interface ApiProduct {
  id: number;
  name: string;
  category: number;
  category_name: string;
  price: string | number;
  original_price: string | number | null;
  discount: number;
  image: string;
  description: string;
  stock: number;
  is_hot: boolean;
}
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  image: string | null;
  hero_image: string | null;
  products: ApiProduct[];
}
export interface CheckoutItem { product: number; quantity: number; size: string }
export interface CheckoutRequest {
  checkout_key: string;
  shipping_address: string;
  items: CheckoutItem[];
}
export interface CustomerOrder {
  id: number;
  order_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  shipping_address: string;
  items: { id: number; product: number; product_name: string; quantity: number; price: string; size: string }[];
}
