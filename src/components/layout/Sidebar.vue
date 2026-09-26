<script setup lang="ts">
import { ref } from "vue";

// Defined in SFC to satisfy @astrojs/vue compiler-sfc prop generation constraint
interface Props {
  readonly initials: string;
  readonly name: string;
  readonly title: string;
  readonly contact: {
    readonly email: string;
    readonly phone: string;
    readonly location: string;
    readonly linkedin: string;
    readonly github: string;
  };
  readonly languages: readonly { readonly name: string; readonly level: string }[];
}

defineProps<Props>();

const isActive = ref(false);

const toggleActive = (): void => {
  isActive.value = !isActive.value;
};
</script>

<template>
  <div
    class="relative z-1 mbe-4 w-full min-w-70 sm:mbe-8 xl:sticky xl:top-15 xl:mx-0 xl:mbe-0 xl:w-auto xl:max-w-none xl:block-full xl:inline-auto xl:max-block-max"
  >
    <aside
      class="overflow-hidden rounded-card border-2 border-glass-border bg-bg p-4 shadow-1 transition-all duration-500 ease-in-out sm:p-8 lg:shadow-5 xl:pbs-15 xl:block-full xl:max-block-max"
      :class="isActive ? 'max-block-375' : 'max-block-28 sm:max-block-45'"
    >
      <!-- ── Sidebar Info Row ── -->
      <header class="relative flex items-center justify-start gap-4 sm:gap-6 xl:flex-col">
        <!-- Avatar -->
        <div
          class="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-[#C0C0C0] bg-linear-to-r from-violet to-blueviolet text-[1.25rem] font-bold text-bg shadow-2 drop-shadow-lg transition-transform sm:size-30 sm:text-[2.25rem] xl:mx-auto xl:size-37.5 xl:text-[3rem] pointer-fine:hover:scale-105"
        >
          {{ initials }}
        </div>

        <!-- Name & Title -->
        <div class="xl:text-center">
          <p
            class="mbe-2 bg-radial-[at_center_top] from-indigo to-blueviolet bg-clip-text text-[1.0625rem] font-medium tracking-tight text-transparent uppercase sm:mbe-4 sm:text-[1.625rem] xl:whitespace-nowrap"
          >
            {{ name.split(" ")[0] }}
            <span class="font-extrabold">{{ name.split(" ")[1] }}</span>
          </p>
          <p
            class="w-max rounded-full bg-white/8 px-3 py-0.5 text-[0.6875rem] font-light text-text sm:px-4.5 sm:py-1 sm:text-xs xl:mx-auto"
          >
            {{ title }}
          </p>
        </div>
      </header>

      <!-- ── Expandable Details ── -->
      <div
        class="transition-all duration-500 ease-in-out"
        :class="isActive ? 'visible opacity-100' : 'invisible opacity-0 xl:visible xl:opacity-100'"
      >
        <!-- Separator -->
        <hr class="my-4 h-0.5 w-full border-0 bg-glass-border sm:my-8" />

        <!-- Contacts -->
        <address class="not-italic">
          <ul
            class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-x-4 md:gap-y-8 xl:grid-cols-1"
          >
            <li class="flex items-center gap-4 min-inline-full">
              <div
                class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-blueviolet bg-card text-blueviolet shadow-1 transition-all hover:shadow-3 sm:size-12 sm:text-lg pointer-fine:hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 sm:size-5"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                  />
                </svg>
              </div>
              <div
                class="w-[calc(100%-46px)] max-w-[calc(100%-46px)] sm:w-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]"
              >
                <p class="mbe-0.5 text-[0.6875rem] text-text-muted/70 uppercase sm:text-xs">
                  Email
                </p>
                <span
                  class="block text-[0.8125rem] text-text sm:text-[0.9375rem] xl:overflow-hidden xl:text-ellipsis xl:whitespace-nowrap"
                  >{{ contact.email }}</span
                >
              </div>
            </li>

            <li class="flex items-center gap-4 min-inline-full">
              <div
                class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-blueviolet bg-card text-blueviolet shadow-1 transition-all hover:shadow-3 sm:size-12 sm:text-lg pointer-fine:hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 sm:size-5"
                >
                  <path
                    d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
                  />
                </svg>
              </div>
              <div
                class="w-[calc(100%-46px)] max-w-[calc(100%-46px)] sm:w-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]"
              >
                <p class="mbe-0.5 text-[0.6875rem] text-text-muted/70 uppercase sm:text-xs">
                  Phone
                </p>
                <span
                  class="block text-[0.8125rem] text-text sm:text-[0.9375rem] xl:overflow-hidden xl:text-ellipsis xl:whitespace-nowrap"
                  >{{ contact.phone }}</span
                >
              </div>
            </li>

            <li class="flex items-center gap-4 min-inline-full">
              <div
                class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-blueviolet bg-card text-blueviolet shadow-1 transition-all hover:shadow-3 sm:size-12 sm:text-lg pointer-fine:hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 sm:size-5"
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
              </div>
              <div
                class="w-[calc(100%-46px)] max-w-[calc(100%-46px)] sm:w-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]"
              >
                <p class="mbe-0.5 text-[0.6875rem] text-text-muted/70 uppercase sm:text-xs">
                  Location
                </p>
                <span
                  class="block text-[0.8125rem] text-text sm:text-[0.9375rem] xl:overflow-hidden xl:text-ellipsis xl:whitespace-nowrap"
                  >{{ contact.location }}</span
                >
              </div>
            </li>

            <li class="flex items-center gap-4 min-inline-full">
              <div
                class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-blueviolet bg-card text-blueviolet shadow-1 transition-all hover:shadow-3 sm:size-12 sm:text-lg pointer-fine:hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 sm:size-5"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  />
                  <rect
                    width="4"
                    height="12"
                    x="2"
                    y="9"
                  />
                  <circle
                    cx="4"
                    cy="4"
                    r="2"
                  />
                </svg>
              </div>
              <div
                class="w-[calc(100%-46px)] max-w-[calc(100%-46px)] sm:w-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]"
              >
                <p class="mbe-0.5 text-[0.6875rem] text-text-muted/70 uppercase sm:text-xs">
                  LinkedIn
                </p>
                <span
                  class="block text-[0.8125rem] text-text sm:text-[0.9375rem] xl:overflow-hidden xl:text-ellipsis xl:whitespace-nowrap"
                  >{{ contact.linkedin }}</span
                >
              </div>
            </li>

            <li class="flex items-center gap-4 min-inline-full">
              <div
                class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-blueviolet bg-card text-blueviolet shadow-1 transition-all hover:shadow-3 sm:size-12 sm:text-lg pointer-fine:hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-4 sm:size-5"
                >
                  <path
                    d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
                  />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </div>
              <div
                class="w-[calc(100%-46px)] max-w-[calc(100%-46px)] sm:w-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]"
              >
                <p class="mbe-0.5 text-[0.6875rem] text-text-muted/70 uppercase sm:text-xs">
                  GitHub
                </p>
                <span
                  class="block text-[0.8125rem] text-text sm:text-[0.9375rem] xl:overflow-hidden xl:text-ellipsis xl:whitespace-nowrap"
                  >{{ contact.github }}</span
                >
              </div>
            </li>
          </ul>
        </address>

        <!-- Separator -->
        <hr class="my-4 h-0.5 w-full border-0 bg-glass-border sm:my-8" />

        <!-- Languages -->
        <section aria-label="Languages">
          <h3
            class="mbe-4 text-[0.6875rem] font-medium tracking-[0.2em] text-blueviolet uppercase sm:text-xs"
          >
            Languages
          </h3>
          <dl class="space-y-2">
            <div
              v-for="lang in languages"
              :key="lang.name"
              class="flex justify-between text-[0.8125rem] text-text-muted sm:text-[0.9375rem]"
            >
              <dt>{{ lang.name }}</dt>
              <dd>{{ lang.level }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </aside>

    <!-- Toggle Button -->
    <button
      class="absolute top-0 right-0 z-20 flex cursor-pointer items-center justify-center gap-1 rounded-tl-none rounded-tr-card rounded-br-none rounded-bl-card border-2 border-t-0 border-r-0 border-glass-border bg-card px-2.5 py-2.5 text-[0.8125rem] text-blueviolet shadow-2 transition-all sm:min-w-32 sm:px-4 sm:py-2.5 xl:hidden pointer-fine:hover:bg-white/10 pointer-fine:hover:text-violet"
      :aria-label="isActive ? 'Hide Contacts' : 'Show Contacts'"
      @click="toggleActive"
    >
      <span class="hidden text-xs sm:block">
        {{ isActive ? "Hide Contacts" : "Show Contacts" }}
      </span>
      <span class="sm:hidden">
        <svg
          v-if="isActive"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  </div>
</template>
