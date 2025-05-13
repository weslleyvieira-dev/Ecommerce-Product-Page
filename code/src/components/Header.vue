<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useCartStore } from "../stores/cartStore";
import Cart from "./Cart.vue";

const cartStore = useCartStore();
const cartModalOpen = ref(false);
const isMenuOpen = ref(false);

function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function _toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const toggleMenu = debounce(_toggleMenu);

function _toggleCartModal(autoClose = false) {
  cartModalOpen.value = !cartModalOpen.value;
  if (autoClose) {
    setTimeout(() => {
      cartModalOpen.value = false;
    }, 2500);
  }
}

const toggleCartModal = debounce(_toggleCartModal);

function closeCartModal(event) {
  const cartMenu = document.querySelector(".cart-menu");
  const cartIcon = document.querySelector(".cart-icon");
  if (
    cartMenu &&
    !cartMenu.contains(event.target) &&
    cartIcon &&
    !cartIcon.contains(event.target)
  ) {
    cartModalOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", closeCartModal);
});

onUnmounted(() => {
  document.removeEventListener("click", closeCartModal);
});

watch(
  () => cartStore.cartItems.length,
  (newLen, oldLen) => {
    if (newLen > 0 && oldLen === 0) {
      setTimeout(() => toggleCartModal(true), 1);
    }
  }
);
</script>

<template>
  <div
    v-if="isMenuOpen"
    class="lightbox-container"
    :class="{ 'menu-open': isMenuOpen }"
  ></div>
  <header>
    <div class="menu-container">
      <img
        @click="toggleMenu"
        class="menu-icon"
        :src="
          isMenuOpen
            ? '/assets/icons/icon-close.svg'
            : '/assets/icons/icon-menu.svg'
        "
        :alt="isMenuOpen ? 'Close' : 'Menu'"
      />
      <div class="logo-container">
        <img class="logo" src="/assets/icons/logo.svg" alt="Logo" />
        <nav :class="{ 'menu-open': isMenuOpen }">
          <ul :class="{ 'menu-open': isMenuOpen }">
            <li class="text-preset-4">
              <a href="#">Collections</a>
            </li>
            <li class="text-preset-4">
              <a href="#">Men</a>
            </li>
            <li class="text-preset-4">
              <a href="#">Women</a>
            </li>
            <li class="text-preset-4">
              <a href="#">About</a>
            </li>
            <li class="text-preset-4">
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="actions-container">
      <div class="cart-container">
        <img
          v-on:click="toggleCartModal(false)"
          class="cart-icon"
          :class="{ 'cart-icon-active': cartModalOpen }"
          src="/assets/icons/icon-cart.svg"
          alt="Cart"
        />
        <transition name="fade" mode="out-in">
          <Cart
            v-if="cartModalOpen"
            :cartItems="cartStore.cartItems"
            class="cart-menu"
          />
        </transition>
        <span v-if="cartStore.cartCount" class="cart-count">{{
          cartStore.cartCount
        }}</span>
      </div>
      <img
        class="profile-pic"
        src="/assets/images/image-avatar.png"
        alt="Profile"
      />
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10.313rem;
  height: 7rem;
  width: -webkit-fill-available;
  width: -moz-available;
  border-bottom: 1px solid var(--grey-100);
}

.menu-icon {
  display: none;
}

.logo-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 3.5rem;
}

.logo {
  height: 1.25rem;
  width: 8.6rem;
}

nav ul {
  display: flex;
  flex-direction: row;
  list-style: none;
  gap: 2rem;
  padding: 0;
}

nav ul li a {
  text-decoration: none;
  color: var(--grey-500);
}

.actions-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 3rem;
}

.cart-container {
  position: relative;
}

.cart-icon {
  width: 1.375rem;
  height: 1.25rem;
  cursor: pointer;
}

.cart-icon:hover,
.cart-icon-active {
  filter: brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(747%)
    hue-rotate(191deg) brightness(93%) contrast(89%);
}

.cart-count {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--orange-500);
  color: white;
  border-radius: 0.4rem;
  font-weight: bold;
  font-size: 0.625rem;
  width: 1.188rem;
  height: 0.813rem;
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
}

.cart-menu {
  position: absolute;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.profile-pic {
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  cursor: pointer;
}

.profile-pic:hover {
  border: 2px solid var(--orange-500);
  resize: none;
  box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(0%);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateX(-50%);
}

@media (max-width: 1024px) {
  header {
    margin: 0 5rem;
  }

  .menu-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .menu-icon {
    display: flex;
    width: 1rem;
    height: 1rem;
    align-self: end;
    cursor: pointer;
    z-index: 11;
  }

  .logo-container nav {
    visibility: hidden;
  }

  .logo-container nav.menu-open {
    visibility: visible;
  }

  .logo-container nav ul {
    flex-direction: column;
    height: 100vh;
    background-color: white;
    align-items: start;
    width: 18.75rem;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 7.25rem 0 0 5rem;
    resize: none;
    box-sizing: border-box;
    transition: all 0.5s ease;
    transform: translateX(-100%);
  }

  .logo-container nav ul.menu-open {
    visibility: visible;
    transform: translateX(0);
  }

  nav ul {
    gap: 1.5rem;
  }

  nav ul li a {
    color: var(--grey-950);
    font-size: 1.125rem;
    font-weight: bold;
    line-height: 1.625rem;
  }

  .lightbox-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75);
  }
}

@media (max-width: 767px) {
  header {
    height: 4.25rem;
    border-bottom: none;
    margin: 0 1.5rem;
  }

  .logo-container nav ul {
    width: 15.625rem;
    padding-left: 1.5rem;
  }

  .cart-menu {
    position: fixed;
    top: 4.75rem;
    left: 0;
    transform: none;
    margin: 0 0.5rem;
  }

  .actions-container {
    gap: 1.5rem;
  }

  .profile-pic {
    width: 2rem;
    height: 2rem;
  }
}
</style>
