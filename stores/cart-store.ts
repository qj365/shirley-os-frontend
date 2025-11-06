import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
              JSON.stringify(item.variantOptionIds.sort())
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

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemById: id => {
        return get().items.find(item => item.id === id);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
