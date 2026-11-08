import { getAllPages } from './listing';
import api from '../api/client';
import type { CustomerOrder, ApiProduct } from '../types/api';
import type { Product, InventoryStatus } from '../types/components/admin/adminProducts/adminProductsInterface';
import type { Order } from '../types/components/admin/adminOrders/adminOrdersInterface';
import type { DashboardStats } from '../types/components/admin/adminDashboard/adminDashboardInterface';
import type { SalesAnalytics, UserAnalytics, TopProduct } from '../types/components/admin/adminAnalytics/adminAnalyticsInterface';
export interface ProductWrite {
  name: string; description: string; price: number; original_price: number | null;
  stock: number; category: number | null; image: string; is_hot: boolean;
}
const product = (value: ApiProduct): Product => ({ ...value, price: Number(value.price), original_price: value.original_price === null ? undefined : Number(value.original_price) });
type ApiOrder = CustomerOrder & { user_name: string; notes?: string };
const order = (value: ApiOrder): Order => ({ ...value, total_amount: Number(value.total_amount), items: value.items.map(item => ({ ...item, price: Number(item.price), total_price: Number(item.price) * item.quantity })) });
export const adminService = {
  products: async () => (await getAllPages<ApiProduct>('/admin/products/')).map(product),
  createProduct: async (data: ProductWrite) => product(await api.post<ApiProduct>('/admin/products/', data)),
  updateProduct: async (id: string, data: ProductWrite) => product(await api.patch<ApiProduct>(`/admin/products/${id}/`, data)),
  deleteProduct: (id: string) => api.delete<void>(`/admin/products/${id}/`),
  stock: async (id: string, stock: number) => product(await api.post<ApiProduct>(`/admin/products/${id}/update_stock/`, { stock })),
  inventory: () => api.get<InventoryStatus>('/admin/products/inventory_status/'),
  lowStock: async () => (await getAllPages<ApiProduct>('/admin/products/low_stock_products/')).map(product),
  outOfStock: async () => (await getAllPages<ApiProduct>('/admin/products/out_of_stock_products/')).map(product),
  orders: async () => (await getAllPages<ApiOrder>('/admin/orders/')).map(order),
  recentOrders: async (days = 7) => (await getAllPages<ApiOrder>('/admin/orders/recent_orders/', { params: { days } })).map(order),
  updateOrder: async (id: number, status: string) => order((await api.post<{ order: ApiOrder }>(`/admin/orders/${id}/update_status/`, { status })).order),
  dashboard: () => api.get<DashboardStats>('/admin/dashboard/stats/'),
  sales: async (period: string): Promise<SalesAnalytics> => {
    const response = await api.get<{ data: { date: string; sales: number; orders: number }[]; average_order_value: number }>('/admin/analytics/sales/', { params: { period } });
    return {
      daily_sales: response.data.map(row => ({ date: row.date, total: row.sales })),
      total_sales: response.data.reduce((total, row) => total + row.sales, 0),
      total_orders: response.data.reduce((total, row) => total + row.orders, 0),
      avg_order_value: response.average_order_value,
    };
  },
  users: async (period: string): Promise<UserAnalytics> => {
    const response = await api.get<{ daily_logins: { date: string; logins: number }[]; activity_breakdown: { activity_type: string; count: number }[] }>('/admin/analytics/users/', { params: { period } });
    return { daily_logins: response.daily_logins.map(row => ({ date: row.date, count: row.logins })), activity_breakdown: response.activity_breakdown.map(row => ({ type: row.activity_type, count: row.count })) };
  },
  topProducts: async (limit: number): Promise<TopProduct[]> => {
    const response = await api.get<{ products: { product__id: number; product__name: string; total_revenue: string | number; total_sold: number }[] }>('/admin/analytics/top-products/', { params: { limit } });
    return response.products.map(row => ({ id: row.product__id, name: row.product__name, total_revenue: Number(row.total_revenue), total_sold: row.total_sold }));
  },
};
