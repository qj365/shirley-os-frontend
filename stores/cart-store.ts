import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SUBSCRIPTION_FREQUENCIES = [2, 4, 6, 8] as const;
export type SubscriptionFrequency = (typeof SUBSCRIPTION_FREQUENCIES)[number];
export type CartPaymentPlan = 'one_time' | 'subscription';

export interface CartItem {
  id: string; // unique ID for cart item (variantId + timestamp)
  productId: number;
  productName: string;
  variantId: number;
  variantOptionIds: number[];
  variantTitle: string; // e.g., "Size: Large, Color: Red"
  quantity: number;
  price: number;
  compareAtPrice: number;
  image: string;
  stock: number;
  minOrder: number;
  categoryName: string;
  paymentPlan: CartPaymentPlan;
  deliveryFrequencyWeeks: SubscriptionFrequency | null;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemPayment: (
    id: string,
    paymentPlan: CartPaymentPlan,
    deliveryFrequencyWeeks?: SubscriptionFrequency | null
  ) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemById: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: item => {
        const items = get().items;

        const normalizedPaymentPlan = item.paymentPlan ?? 'one_time';
        const normalizedFrequency =
          normalizedPaymentPlan === 'subscription'
            ? (item.deliveryFrequencyWeeks ?? SUBSCRIPTION_FREQUENCIES[0])
            : null;

        // Check minimum order requirement (default is 1)
        const minOrder = 1;
        if (item.quantity < minOrder) {
          throw new Error(
            `Minimum order quantity is ${minOrder} for this product`
          );
        }

        // Check if item with same variant already exists
        const existingItem = items.find(
          i =>
            i.productId === item.productId &&
            JSON.stringify(i.variantOptionIds.sort()) ===
              JSON.stringify(item.variantOptionIds.sort()) &&
            i.paymentPlan === normalizedPaymentPlan &&
            (i.deliveryFrequencyWeeks ?? null) === normalizedFrequency
        );

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = existingItem.quantity + item.quantity;

          // Check stock limit
          if (newQuantity > item.stock) {
            throw new Error(`Only ${item.stock} item(s) available in stock`);
          }

          set({
            items: items.map(i =>
              i.id === existingItem.id ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            ...item,
            id: `${item.variantId}-${Date.now()}`,
            paymentPlan: normalizedPaymentPlan,
            deliveryFrequencyWeeks: normalizedFrequency,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: id => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        const item = get().items.find(i => i.id === id);
        if (item) {
          // Check minimum order requirement (default is 1)
          const minOrder = 1;
          if (quantity < minOrder) {
            throw new Error(
              `Minimum order quantity is ${minOrder} for this product`
            );
          }

          // Check stock limit
          if (quantity > item.stock) {
            throw new Error(`Only ${item.stock} item(s) available in stock`);
          }
        }

        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      updateItemPayment: (id, paymentPlan, deliveryFrequencyWeeks) => {
        set({
          items: get().items.map(item => {
            if (item.id !== id) {
              return item;
            }

            const normalizedPlan = paymentPlan ?? 'one_time';
            const normalizedFrequency =
              normalizedPlan === 'subscription'
                ? (deliveryFrequencyWeeks ??
                  item.deliveryFrequencyWeeks ??
                  SUBSCRIPTION_FREQUENCIES[0])
                : null;

            return {
              ...item,
              paymentPlan: normalizedPlan,
              deliveryFrequencyWeeks: normalizedFrequency,
            };
          }),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const multiplier = item.paymentPlan === 'subscription' ? 0.9 : 1;
          return total + item.price * multiplier * item.quantity;
        }, 0);
      },

      getItemById: id => {
        return get().items.find(item => item.id === id);
      },
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: state => {
        if (!state || typeof state !== 'object') return state;

        const persisted = state as {
          items?: Array<
            Omit<CartItem, 'paymentPlan' | 'deliveryFrequencyWeeks'> & {
              paymentPlan?: CartPaymentPlan;
              deliveryFrequencyWeeks?: SubscriptionFrequency | null;
            }
          >;
        };

        if (!Array.isArray(persisted.items)) {
          return state;
        }

        return {
          ...state,
          items: persisted.items.map(item => {
            const paymentPlan: CartPaymentPlan = item.paymentPlan ?? 'one_time';
            const deliveryFrequencyWeeks =
              paymentPlan === 'subscription'
                ? (item.deliveryFrequencyWeeks ?? SUBSCRIPTION_FREQUENCIES[0])
                : null;

            return {
              ...item,
              paymentPlan,
              deliveryFrequencyWeeks,
            };
          }),
        };
      },
    }
  )
);
