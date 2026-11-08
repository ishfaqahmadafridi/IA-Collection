import type { CartItem } from '../types/components/cart/cartInterface';
import type { CheckoutRequest } from '../types/api';
export function checkoutPayload(checkout_key: string, address: string, items: CartItem[]): CheckoutRequest {
  return {
    checkout_key,
    shipping_address: address.trim(),
    items: items.map(item => ({ product: item.id, quantity: item.quantity, size: item.size || '' })),
  };
}
