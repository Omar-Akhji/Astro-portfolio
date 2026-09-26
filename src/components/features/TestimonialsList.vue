<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";

// Defined in SFC to satisfy @astrojs/vue compiler-sfc prop generation constraint
interface Testimonial {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly text: string;
  readonly date: string;
}

const props = defineProps<{ readonly testimonials: readonly Testimonial[] }>();

const activeTestimonial = ref<number | null>(null);
const dialogRef = ref<HTMLDialogElement | null>(null);

const selectedTestimonial = computed<Testimonial | null>((): Testimonial | null => {
  if (activeTestimonial.value === null) return null;
  return props.testimonials[activeTestimonial.value] ?? null;
});

watch(activeTestimonial, (newVal: number | null): void => {
  const dialog = dialogRef.value;
  if (!dialog) return;
  if (newVal !== null && !dialog.open) {
    dialog.showModal();
  } else if (newVal === null && dialog.open) {
    dialog.close();
  }
});

const openTestimonial = (idx: number): void => {
  activeTestimonial.value = idx;
};

const closeTestimonial = (): void => {
  activeTestimonial.value = null;
};

onMounted(() => {
  const dialog = dialogRef.value;
  if (!dialog) return;
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      closeTestimonial();
    }
  });
});
</script>

<template>
  <section class="mb-12">
    <ul
      class="has-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-6 pb-8 md:pb-10"
    >
      <li
        v-for="(testimonial, idx) in testimonials"
        :key="testimonial.id"
        class="relative mt-8 w-full shrink-0 cursor-pointer snap-center rounded-2xl border-2 border-glass-border bg-white/5 p-3.75 pt-11.25 transition-all hover:bg-white/8 focus:ring-2 focus:ring-blueviolet/50 focus:outline-hidden md:w-[calc(50%-0.5rem)] lg:w-[calc(50%-0.5rem)]"
        tabindex="0"
        role="button"
        :aria-label="`View ${testimonial.name}'s testimonial`"
        @click="openTestimonial(idx)"
        @keydown.enter.prevent="openTestimonial(idx)"
        @keydown.space.prevent="openTestimonial(idx)"
      >
        <figure>
          <div
            class="absolute top-0 left-0 flex size-16 translate-x-3.75 -translate-y-6.25 items-center justify-center rounded-full border-2 border-glass-border bg-bg bg-linear-to-br from-violet/10 to-blueviolet/10 shadow-2"
          >
            <span
              class="bg-linear-to-br from-violet to-blueviolet bg-clip-text text-2xl font-bold text-transparent"
            >
              {{ testimonial.name.charAt(0) }}
            </span>
          </div>

          <figcaption class="mb-2">
            <h4 class="mb-1 font-medium text-text">
              {{ testimonial.name }}
            </h4>
            <time class="text-xs font-semibold text-violet">
              {{ testimonial.date }}
            </time>
          </figcaption>

          <blockquote class="m-0">
            <p class="line-clamp-4 text-sm leading-relaxed font-light text-text-muted">
              {{ testimonial.text }}
            </p>
          </blockquote>
        </figure>
      </li>
    </ul>

    <dialog
      ref="dialogRef"
      class="fixed inset-0 m-auto h-max max-h-[90vh] w-max max-w-[min(90vw,32rem)] scale-95 scrollbar-none overflow-y-auto overscroll-contain rounded-[0.875rem] border-2 border-glass-border bg-bg p-0 text-text opacity-0 shadow-5 transition-[opacity,transform,overlay,display] duration-250 ease-in-out backdrop:bg-black/80 backdrop:backdrop-blur-sm backdrop:transition-[background-color,backdrop-filter,overlay,display] backdrop:duration-250 backdrop:ease-in-out open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0"
      aria-label="Testimonial details"
      @cancel="closeTestimonial"
      @close="closeTestimonial"
    >
      <div
        v-if="selectedTestimonial"
        class="relative p-4 md:p-6"
      >
        <button
          class="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border-2 border-glass-border bg-card text-text transition-colors hover:text-blueviolet"
          @click="closeTestimonial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <figure class="m-0">
          <figcaption class="mb-6 flex items-center gap-4">
            <div
              class="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-glass-border bg-bg bg-linear-to-br from-violet/10 to-blueviolet/10 shadow-2"
            >
              <span
                class="bg-linear-to-br from-violet to-blueviolet bg-clip-text text-3xl font-bold text-transparent"
              >
                {{ selectedTestimonial.name.charAt(0) }}
              </span>
            </div>
            <div>
              <h4 class="text-lg font-medium text-text">
                {{ selectedTestimonial.name }}
              </h4>
              <time class="text-sm font-semibold text-violet">
                {{ selectedTestimonial.date }}
              </time>
            </div>
          </figcaption>
          <blockquote class="m-0">
            <p class="leading-relaxed font-light text-text-muted">
              {{ selectedTestimonial.text }}
            </p>
          </blockquote>
        </figure>
      </div>
    </dialog>
  </section>
</template>
