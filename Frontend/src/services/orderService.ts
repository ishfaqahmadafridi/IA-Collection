import api from '../api/client';
import type { CheckoutRequest, CustomerOrder } from '../types/api';
export const orderService = {
  checkout: (data: CheckoutRequest) => api.post<CustomerOrder>('/orders/', data),
  track: (number: string) => api.get<CustomerOrder>(`/orders/${encodeURIComponent(number.trim())}/`),
};
