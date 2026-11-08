import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { activityService } from '../../services/activityService';
import { registerSessionReset } from '../../utils/session';
import type {
  CartItem,
  AddToCartPayload,
  RemoveFromCartPayload,
  UpdateQuantityPayload
} from '../../types/components/cart/cartInterface';

export interface CartState {
  items: CartItem[];
  checkoutKey: string;
  shippingAddress: string;
  setShippingAddress: (address: string) => void;

  addToCart: (item: AddToCartPayload) => void;
  removeFromCart: (payload: RemoveFromCartPayload) => void;
  updateQuantity: (payload: UpdateQuantityPayload) => void;
  clearCart: () => void;

  // Selectors as getter methods
  getCartItems: () => CartItem[];
  getCartTotalQuantity: () => number;
  getCartSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutKey: crypto.randomUUID(),
      shippingAddress: '',
      setShippingAddress: address => set(state => address === state.shippingAddress ? {} : { shippingAddress: address, checkoutKey: crypto.randomUUID() }),

      addToCart: (newItem) => {
        // Log activity to backend
        if (!Number.isSafeInteger(newItem.id) || newItem.id <= 0 || !Number.isSafeInteger(newItem.quantity ?? 1) || (newItem.quantity ?? 1) < 1 || !Number.isFinite(newItem.price) || newItem.price < 0) throw new Error('Invalid product or quantity.');
        activityService.log('add_to_cart', { product_id: newItem.id, product_name: newItem.name, size: newItem.size }).catch(err => console.error('Failed to log add_to_cart activity', err));

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.size === newItem.size
          );

          const newItems = [...state.items];

          if (existingItemIndex >= 0) {
            const existingItem = newItems[existingItemIndex];
            const newQty = existingItem.quantity + (newItem.quantity || 1);
            newItems[existingItemIndex] = {
              ...existingItem,
              quantity: newQty,
              totalPrice: newQty * existingItem.price,
            };
          } else {
            const qty = newItem.quantity || 1;
            newItems.push({
              ...newItem,
              quantity: qty,
              totalPrice: qty * newItem.price,
            });
          }

          return { items: newItems, checkoutKey: crypto.randomUUID() };
        });
      },

      removeFromCart: ({ id, size }) => set((state) => ({
        items: state.items.filter((item) => !(item.id === id && item.size === size)),
        checkoutKey: crypto.randomUUID()
      })),

      updateQuantity: ({ id, size, quantity }) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('Quantity must be a positive whole number.');
        set((state) => ({
        checkoutKey: crypto.randomUUID(),
        items: state.items.map((item) => {
          if (item.id === id && item.size === size) {
            return {
              ...item,
              quantity,
              totalPrice: quantity * item.price
            };
          }
          return item;
        })
      }));
      },

      clearCart: () => set({ items: [], checkoutKey: crypto.randomUUID(), shippingAddress: '' }),

      // derived state functions
      getCartItems: () => get().items,
      getCartTotalQuantity: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getCartSubtotal: () => get().items.reduce((total, item) => total + item.totalPrice, 0),
    }),
    {
      name: 'ecommerce-cart-storage',
      version: 1, // Discard legacy carts containing static/synthetic product IDs.
      migrate: () => ({ items: [], checkoutKey: crypto.randomUUID() }), // unique name for localStorage key
    }
  )
);

registerSessionReset(() => useCartStore.getState().clearCart());
