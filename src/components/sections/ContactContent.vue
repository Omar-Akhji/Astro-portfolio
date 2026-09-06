<script setup lang="ts">
import { ref } from "vue";

// Define interface inline to avoid Vue SFC compiler fs resolution limitations in Astro builds
interface ContactFormState {
  success: boolean;
  message: string;
  errors?: { fullname?: string; email?: string; message?: string };
}

const mapLoaded = ref(false);
const isPending = ref(false);
const state = ref<ContactFormState>({ success: false, message: "" });

const loadMap = () => {
  mapLoaded.value = true;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  isPending.value = true;
  state.value = { success: false, message: "" };

  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  try {
    const response = await fetch("/api/contact", { method: "POST", body: formData });
    const data = await response.json();
    state.value = data;
    if (response.ok && data.success) {
      form.reset();
    }
  } catch {
    state.value = { success: false, message: "Failed to send message. Please try again later." };
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <div>
    <!-- ── Map ── -->
    <section class="mbe-10">
      <div
        class="relative overflow-hidden rounded-2xl border-2 border-glass-border bg-white/5 block-62.5 inline-full sm:block-100"
      >
        <iframe
          v-if="mapLoaded"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105884.81432412854!2d-6.911831826075939!3d33.96919056678258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871af50c5f%3A0xb003097fa3670ee9!2sRabat!5e0!3m2!1sen!2sma!4v1710000000000!5m2!1sen!2sma"
          title="Google Maps location of Rabat, Morocco"
          width="100%"
          height="100%"
          style="border: 0"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          class="grayscale invert"
        />
        <button
          v-else
          type="button"
          class="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 transition-colors hover:bg-white/5"
          aria-label="Load interactive map"
          @click="loadMap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-10 text-blueviolet opacity-60"
          >
            <path
              d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
            />
            <circle
              cx="12"
              cy="10"
              r="3"
            />
          </svg>
          <span class="text-sm font-medium text-text-muted"> Click to load map </span>
          <span class="text-xs text-text-muted/50">Rabat, Morocco</span>
        </button>
      </div>
    </section>

    <!-- ── Contact Form ── -->
    <section>
      <h3 class="mbe-6 text-xl font-semibold text-text capitalize sm:text-2xl">Contact Form</h3>

      <!-- Status Banner -->
      <div
        v-if="state.message && !state.errors"
        class="mbe-6 flex items-center gap-3 rounded-xl border-2 p-4"
        :class="
          state.success ?
            'border-green-500/30 bg-green-500/10 text-green-400'
          : 'border-red-500/30 bg-red-500/10 text-red-400'
        "
        role="alert"
      >
        <svg
          v-if="state.success"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5 shrink-0"
        >
          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5 shrink-0"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            x2="12"
            y1="8"
            y2="12"
          />
          <line
            x1="12"
            x2="12.01"
            y1="16"
            y2="16"
          />
        </svg>
        <p class="text-sm font-medium">{{ state.message }}</p>
      </div>

      <form
        class="space-y-6"
        @submit="handleSubmit"
      >
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              for="fullname"
              class="sr-only"
            >
              Full name
            </label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              class="rounded-xl border-2 border-glass-border bg-card p-4 text-text transition-all inline-full placeholder:text-text-muted user-valid:border-green-500/50! user-invalid:border-red-500/50! focus:border-blueviolet focus:ring-1 focus:ring-blueviolet/50 focus:outline-none"
              :class="state.errors?.fullname ? 'border-red-500/50!' : ''"
              placeholder="Full name"
              required
              :disabled="isPending"
            />
            <p
              v-if="state.errors?.fullname"
              class="mbs-1.5 text-xs font-medium text-red-400"
            >
              {{ state.errors.fullname }}
            </p>
          </div>
          <div>
            <label
              for="email"
              class="sr-only"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              class="rounded-xl border-2 border-glass-border bg-card p-4 text-text transition-all inline-full placeholder:text-text-muted user-valid:border-green-500/50! user-invalid:border-red-500/50! focus:border-blueviolet focus:ring-1 focus:ring-blueviolet/50 focus:outline-none"
              :class="state.errors?.email ? 'border-red-500/50!' : ''"
              placeholder="Email address"
              required
              :disabled="isPending"
            />
            <p
              v-if="state.errors?.email"
              class="mbs-1.5 text-xs font-medium text-red-400"
            >
              {{ state.errors.email }}
            </p>
          </div>
        </div>

        <div>
          <label
            for="message"
            class="sr-only"
          >
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            class="resize-y rounded-xl border-2 border-glass-border bg-card p-4 text-text transition-all inline-full min-block-37.5 placeholder:text-text-muted user-valid:border-green-500/50! user-invalid:border-red-500/50! focus:border-blueviolet focus:ring-1 focus:ring-blueviolet/50 focus:outline-none"
            :class="state.errors?.message ? 'border-red-500/50!' : ''"
            placeholder="Your Message"
            required
            :disabled="isPending"
          />
          <p
            v-if="state.errors?.message"
            class="mt-1.5 text-xs font-medium text-red-400"
          >
            {{ state.errors.message }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isPending"
          class="group ml-auto flex cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet to-blueviolet p-3 font-semibold text-bg shadow-[0_0_15px_rgba(99,70,230,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(99,70,230,0.6)] focus:outline-none disabled:pointer-events-none disabled:opacity-60 sm:px-6 sm:py-3"
        >
          <svg
            v-if="isPending"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-5 animate-spin sm:hidden"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-5 sm:hidden"
          >
            <path
              d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
            />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
          <span class="hidden sm:inline">
            {{ isPending ? "Sending..." : "Send Message" }}
          </span>
        </button>
      </form>
    </section>
  </div>
</template>
