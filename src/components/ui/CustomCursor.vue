<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const dotRef = ref<HTMLDivElement | null>(null);
const ringRef = ref<HTMLDivElement | null>(null);

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

let rafId = 0;

const onMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dotRef.value) {
    dotRef.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }
};

const animRing = () => {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;

  if (ringRef.value) {
    ringRef.value.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  }

  rafId = requestAnimationFrame(animRing);
};

onMounted(() => {
  globalThis.addEventListener("mousemove", onMouseMove);
  rafId = requestAnimationFrame(animRing);
});

onUnmounted(() => {
  globalThis.removeEventListener("mousemove", onMouseMove);
  cancelAnimationFrame(rafId);
});
</script>

<template>
  <div
    ref="dotRef"
    class="cursor-dot"
  />
  <div
    ref="ringRef"
    class="cursor-ring"
  />
</template>
