<script setup>
import { useCartStore } from "../stores/cartStore";
defineProps(["cartItems"]);

const cartStore = useCartStore();

function discountCalc(price, discount) {
  return price - (price * discount) / 100;
}

function deleteItem(itemId) {
  cartStore.removeFromCart(itemId);
}
</script>

<template>
  <div class="cart-modal">
    <h1 class="text-preset-3-bold">Cart</h1>
    <div class="cart-items" v-if="cartItems.length">
      <div class="item-container" v-for="item in cartItems" :key="item.id">
        <img class="item-thumb" :src="item.thumb1" />
        <div class="item-infos">
          <p class="item-name text-preset-3-regular">{{ item.name }}</p>
          <p class="item-price text-preset-3-regular">
            ${{ discountCalc(item.price, item.discount).toFixed(2) }} x
            {{ item.quantity
            }}<strong
              >${{
                (
                  discountCalc(item.price, item.discount) * item.quantity
                ).toFixed(2)
              }}</strong
            >
          </p>
        </div>
        <img v-on:click="deleteItem(item.id)" class="item-delete" src="/assets/icons/icon-delete.svg" />
      </div>
      <button class="btn-checkout text-preset-3-bold">Checkout</button>
    </div>
    <div v-else class="empty-cart">
      <p class="text-preset-3-bold">Your cart is empty.</p>
    </div>
  </div>
</template>

<style scoped>
.cart-modal {
  display: flex;
  flex-direction: column;
  width: 22.5rem;
  height: 16rem;
  background-color: white;
  border-radius: 0.625rem;
  box-shadow: 0 20px 50px -20px rgba(29, 32, 38, 0.1);
}

h1 {
  color: var(--grey-950);
  padding: 1.5rem 0.75rem;
  border-bottom: 1px solid var(--grey-100);
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.empty-cart p {
  color: var(--grey-500);
  text-align: center;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem;
}

.item-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  width: 100%;
}

.item-thumb {
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 0.4rem;
}

.item-name,
.item-price {
  color: var(--grey-500);
}

.item-price strong {
  margin-left: 0.5rem;
  color: var(--grey-950);
}

.item-delete {
  height: 1rem;
  width: 0.875rem;
  cursor: pointer;
}

.btn-checkout {
  color: var(--grey-950);
  background-color: var(--orange-500);
  border-radius: 0.625rem;
  border: none;
  height: 3.5rem;
}
</style>
