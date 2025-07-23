import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  sizes: string;
  imageUrl: string[];
  quantity: number;
}

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productToRemove: Product) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) => {
    const existing = get().cart.find(
      (item) => item.id === product.id && item.sizes === product.sizes
    );

    if (!existing) {
      set((state) => ({
        cart: [...state.cart, { ...product, quantity: 1 }]
      }));
    } else {
      set((state) => ({
        cart: state.cart.map((item) =>
          item.id === product.id && item.sizes === product.sizes
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    }
  },

  removeFromCart: (productToRemove) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          !(
            item.id === productToRemove.id &&
            item.sizes === productToRemove.sizes
          )
      )
    }));
  },

  clearCart: () => set({ cart: [] })
}));
