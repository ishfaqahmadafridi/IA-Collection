import type { Order } from '../../types/components/admin/adminOrders/adminOrdersInterface';
export function summarizeOrders(orders: Order[]) {
  return {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    processing: orders.filter(order => order.status === 'processing').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  };
}
export function filterOrders(orders: Order[], filter: string) {
  return filter === 'all' ? orders : orders.filter(order => order.status === filter);
}
