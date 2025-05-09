import { defineStore } from "pinia";
import productsData from "../data.json";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
  }),
  actions: {
    addToCart(product, quantity) {
      const existingItem = this.cartItems.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cartItems.push({ ...product, quantity });
      }
    },
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    },
  },
  getters: {
    cartCount: (state) =>
      state.cartItems.reduce((count, item) => count + item.quantity, 0),
    cartTotal: (state) =>
      state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
  },
});
