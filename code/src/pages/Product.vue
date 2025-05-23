<script setup>
import { ref } from "vue";
import { useCartStore } from "../stores/cartStore";
import productsData from "../data.json";

const cartStore = useCartStore();
const products = productsData.products;
const productId = ref(1);
const product = products.find((product) => product.id === productId.value);
const images = [product.image1, product.image2, product.image3, product.image4];
const thumbs = [product.thumb1, product.thumb2, product.thumb3, product.thumb4];
const currentImage = ref(images[0]);
const lightboxImage = ref(images[0]);
const currentThumb = ref(thumbs[0]);
const lightboxThumb = ref(thumbs[0]);
const quantityBuy = ref(1);
const lightboxFocus = ref(false);
const isDecreaseDisabled = ref(true);
const slideDirection = ref("next");

function openLightbox() {
  lightboxImage.value = currentImage.value;
  lightboxThumb.value = currentThumb.value;
  lightboxFocus.value = true;
}

function closeLightbox() {
  currentImage.value = lightboxImage.value;
  currentThumb.value = lightboxThumb.value;
  lightboxFocus.value = false;
}

function discountCalc(price, discount) {
  return price - (price * discount) / 100;
}

function handleDecreaseQuantity() {
  if (quantityBuy.value > 1) {
    quantityBuy.value--;
  }
  if (quantityBuy.value === 1) {
    isDecreaseDisabled.value = true;
  }
}

function handleIncreaseQuantity() {
  quantityBuy.value++;
  isDecreaseDisabled.value = false;
}

function addToCart(product, quantity) {
  cartStore.addToCart(product, quantity);
  quantityBuy.value = 1;
  isDecreaseDisabled.value = true;
}

function handleClickPrevious() {
  const active = lightboxFocus.value ? lightboxImage.value : currentImage.value;
  const index = images.indexOf(active);
  slideDirection.value = "prev";
  const targetImage = lightboxFocus.value ? lightboxImage : currentImage;
  const targetThumb = lightboxFocus.value ? lightboxThumb : currentThumb;

  if (index > 0) {
    targetImage.value = images[index - 1];
    targetThumb.value = thumbs[index - 1];
  } else {
    targetImage.value = images[images.length - 1];
    targetThumb.value = thumbs[thumbs.length - 1];
  }
}

function handleClickNext() {
  const active = lightboxFocus.value ? lightboxImage.value : currentImage.value;
  const index = images.indexOf(active);

  slideDirection.value = "next";
  const targetImage = lightboxFocus.value ? lightboxImage : currentImage;
  const targetThumb = lightboxFocus.value ? lightboxThumb : currentThumb;

  if (index < images.length - 1) {
    targetImage.value = images[index + 1];
    targetThumb.value = thumbs[index + 1];
  } else {
    targetImage.value = images[0];
    targetThumb.value = thumbs[0];
  }
}
</script>

<template>
  <main>
    <div v-if="lightboxFocus" class="lightbox" @click.self="closeLightbox()">
      <img
        v-on:click="closeLightbox()"
        class="focus-close"
        src="/assets/icons/icon-close.svg"
      />
      <div class="lightbox-focus">
        <button
          v-on:click="handleClickPrevious()"
          class="focus-previous"
          :class="{ 'slide-prev': slideDirection === 'prev' }"
        >
          <img src="/assets/icons/icon-previous.svg" />
        </button>
        <transition :name="slideDirection" mode="out-in">
          <img
            :key="lightboxImage"
            class="lightbox-image"
            :src="lightboxImage"
          />
        </transition>
        <button
          v-on:click="handleClickNext()"
          class="focus-next"
          :class="{ 'slide-next': slideDirection === 'next' }"
        >
          <img src="/assets/icons/icon-next.svg" />
        </button>
      </div>
      <div class="thumbs-row">
        <div
          v-for="(thumb, index) in thumbs"
          :key="index"
          class="thumb"
          :class="{ 'active-thumb': lightboxImage === images[index] }"
          @click="
            slideDirection =
              index > images.indexOf(lightboxImage) ? 'next' : 'prev';
            lightboxImage = images[index];
            lightboxThumb = thumb;
          "
        >
          <img :src="thumb" />
        </div>
      </div>
    </div>
    <div class="images-container">
      <div class="image-preview">
        <button
          v-on:click="handleClickPrevious()"
          class="preview-prev"
          :class="{ 'slide-prev': slideDirection === 'prev' }"
        >
          <img src="/assets/icons/icon-previous.svg" />
        </button>
        <transition :name="slideDirection" mode="out-in">
          <img
            @click="openLightbox()"
            class="image-focus"
            :src="currentImage"
            :key="currentImage"
          />
        </transition>
        <button
          v-on:click="handleClickNext()"
          class="preview-next"
          :class="{ 'slide-next': slideDirection === 'next' }"
        >
          <img src="/assets/icons/icon-next.svg" />
        </button>
      </div>
      <div class="thumbs-row">
        <div
          v-for="(thumb, index) in thumbs"
          :key="index"
          class="thumb"
          :class="{ 'active-thumb': currentImage === images[index] }"
          @click="
            slideDirection =
              index > images.indexOf(currentImage) ? 'next' : 'prev';
            currentImage = images[index];
            currentThumb = thumb;
          "
        >
          <img :src="thumb" />
        </div>
      </div>
    </div>
    <div class="infos-container">
      <h2 class="text-preset-5">{{ product.company }}</h2>
      <h1 class="text-preset-1">{{ product.name }}</h1>
      <p class="text-preset-3-regular">{{ product.description }}</p>
      <div class="price-container">
        <div class="discount">
          <p class="text-preset-2">
            ${{ discountCalc(product.price, product.discount).toFixed(2) }}
          </p>
          <p class="text-preset-3-bold discount-box">{{ product.discount }}%</p>
        </div>
        <p class="text-preset-3-bold full-price">
          ${{ product.price.toFixed(2) }}
        </p>
      </div>
      <div class="buy-container">
        <div class="quantity-btns">
          <div
            v-on:click="!isDecreaseDisabled && handleDecreaseQuantity()"
            class="quantity-img"
            :class="{ 'not-allowed': isDecreaseDisabled }"
          >
            <img src="/assets/icons/icon-minus.svg" />
          </div>
          <p class="text-preset-3-bold">{{ quantityBuy }}</p>
          <div v-on:click="handleIncreaseQuantity()" class="quantity-img">
            <img src="/assets/icons/icon-plus.svg" />
          </div>
        </div>
        <div v-on:click="addToCart(product, quantityBuy)" class="add-btn">
          <img src="/assets/icons/icon-cart.svg" />
          <p class="text-preset-3-bold">Add to cart</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 13rem;
  gap: 8rem;
  height: calc(99vh - 7rem);
}

.images-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.image-preview .preview-prev,
.image-preview .preview-next {
  display: none;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  justify-content: center;
  align-items: center;
  padding: 0;
  position: absolute;
  background-color: white;
  z-index: 1;
}

.image-preview .preview-prev {
  left: 0.75rem;
}

.image-preview .preview-next {
  right: 0.75rem;
}

.image-preview .preview-prev img,
.image-preview .preview-next img {
  width: 0.75rem;
  height: 1rem;
}

.image-preview .preview-prev:hover,
.image-preview .preview-next:hover {
  opacity: 1;
  background-color: white;
}

.image-preview .preview-prev:hover img,
.image-preview .preview-next:hover img {
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(53%) sepia(77%) saturate(1605%)
    hue-rotate(347deg) brightness(101%) contrast(100%);
}

.image-focus {
  width: 28rem;
  height: 28rem;
  border-radius: 1rem;
  cursor: pointer;
}

.thumbs-row {
  display: flex;
  justify-content: space-between;
  width: 28rem;
  gap: 2rem;
}

.thumb {
  position: relative;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 0.625rem;
  overflow: hidden;
  cursor: pointer;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb:hover::after {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0.5;
}

.thumb.active-thumb {
  border: 2px outset var(--orange-500);
  box-sizing: border-box;
}

.thumb.active-thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0.75;
}

.text-preset-5 {
  color: var(--grey-500);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.text-preset-1 {
  color: var(--grey-950);
}

.text-preset-3-regular {
  color: var(--grey-500);
  margin: 2rem 0;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discount {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.text-preset-2 {
  color: var(--grey-950);
}

.discount-box {
  background-color: var(--grey-950);
  color: white;
  width: 3.2rem;
  height: 1.75rem;
  text-align: center;
  border-radius: 0.375rem;
}

.full-price {
  color: var(--grey-500);
  text-decoration: line-through;
}

.buy-container {
  display: flex;
  gap: 1rem;
  height: 3.5rem;
  margin-top: 2rem;
}

.quantity-btns {
  display: flex;
  width: 9.75rem;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.625rem;
  background-color: var(--grey-50);
}

.quantity-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  padding: 0 0.875rem;
}

.quantity-btns img {
  cursor: pointer;
  width: 0.75rem;
}

.add-btn {
  display: flex;
  gap: 1rem;
  width: 17rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background-color: var(--orange-500);
  box-shadow: 0px 20px 50px rgb(255, 126, 27, 0.25);
  cursor: pointer;
  transition: all 0.15s ease;
}

.add-btn img {
  height: 1rem;
  width: 1.1rem;
  filter: brightness(0) saturate(100%) invert(13%) sepia(0%) saturate(0%)
    hue-rotate(180deg) brightness(93%) contrast(87%);
}

.add-btn:hover {
  background-color: var(--orange-300);
  box-shadow: 0px 20px 50px rgb(255, 171, 106, 0.25);
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.focus-close {
  width: 1.25rem;
  height: 1.25rem;
  filter: brightness(100);
  position: relative;
  left: 16.3rem;
  cursor: pointer;
}

.focus-close:hover {
  filter: brightness(0) saturate(100%) invert(53%) sepia(77%) saturate(1605%)
    hue-rotate(347deg) brightness(101%) contrast(100%);
}

.lightbox-focus {
  display: flex;
  justify-content: center;
  align-items: center;
}

.focus-previous,
.focus-next {
  cursor: pointer;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  position: relative;
  background-color: white;
  z-index: 100;
}

.focus-previous {
  left: 1.75rem;
}

.focus-next {
  right: 1.75rem;
}

.focus-previous img,
.focus-next img {
  width: 1rem;
  height: 1.2rem;
}

.focus-previous:hover,
.focus-next:hover {
  opacity: 1;
  background-color: white;
}

.focus-previous:hover img,
.focus-next:hover img {
  opacity: 1;
  filter: brightness(0) saturate(100%) invert(53%) sepia(77%) saturate(1605%)
    hue-rotate(347deg) brightness(101%) contrast(100%);
}

.lightbox-image {
  width: 34rem;
  height: 34rem;
  border-radius: 1rem;
  margin: 1.5rem 0 2.5rem;
}

.not-allowed {
  cursor: not-allowed !important;
}

.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.next-enter-from {
  transform: translateX(50%);
  opacity: 0;
}
.next-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.next-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.next-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}

.prev-enter-from {
  transform: translateX(-50%);
  opacity: 0;
}
.prev-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.prev-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.prev-leave-to {
  transform: translateX(50%);
  opacity: 0;
}

@media (max-width: 1024px) {
  main {
    flex-direction: column;
    margin: 3rem 5rem;
    height: auto;
    gap: 3rem;
  }

  .images-container {
    width: 100%;
  }

  .image-focus {
    width: 100%;
    pointer-events: none;
  }

  .image-preview .preview-prev,
  .image-preview .preview-next {
    display: flex;
  }

  .thumbs-row {
    display: none;
  }

  .infos-container {
    margin-bottom: 4rem;
  }

  .text-preset-3-regular {
    margin: 1.5rem 0;
  }

  .buy-container {
    margin-top: 1.5rem;
    gap: 0.5rem;
  }

  .quantity-btns, .add-btn {
    width: 50%;
  }
}

@media (max-width: 767px) {
  main {
    margin: 0;
    gap: 1.5rem;
  }

  .image-focus {
    border-radius: 0;
    height: 18.75rem;
    object-fit: cover;
  }

  .infos-container {
    margin: 0 1.5rem 4rem;
  }

  .text-preset-5 {
    margin-bottom: 1rem;
  }

  .text-preset-1 {
    font-size: 1.75rem;
    line-height: 2rem;
  }
  
  .text-preset-3-regular {
    font-size: 0.938rem;
    margin: 1rem 0 2rem;
  }

  .price-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .buy-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 8rem;
    margin-top: 2rem;
    gap: 1rem;
  }

  .quantity-btns, .add-btn {
    width: 100%;
    height: 3.5rem;
  }
}
</style>
