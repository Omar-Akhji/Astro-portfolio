<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Define interface inline to avoid Vue SFC compiler fs resolution limitations in Astro builds
interface Project {
  title: string;
  category: string;
  image: string;
}

const props = defineProps<{ projects: Project[]; categories: string[] }>();

const activeCategory = ref("All");

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(globalThis.location.search);
  const cat = params.get("category") || "All";
  activeCategory.value = cat;
});

const handleCategoryChange = (category: string) => {
  activeCategory.value = category;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(globalThis.location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const newUrl = `${globalThis.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
    globalThis.history.pushState({}, "", newUrl);
  }
};

const filteredProjects = computed(() => {
  return props.projects.filter(
    (project) => activeCategory.value === "All" || project.category === activeCategory.value,
  );
});
</script>

<template>
  <div>
    <!-- ── Filter Tabs ── -->
    <ul
      class="mbe-8 flex flex-wrap items-center justify-start gap-4 border-b-2 border-glass-border pbe-4 sm:gap-6"
    >
      <li
        v-for="cat in categories"
        :key="cat"
      >
        <button
          class="text-sm font-medium transition-colors sm:text-[0.9375rem]"
          :class="
            activeCategory === cat ? 'text-blueviolet' : (
              'cursor-pointer text-text-muted hover:text-text'
            )
          "
          @click="handleCategoryChange(cat)"
        >
          {{ cat }}
        </button>
      </li>
    </ul>

    <!-- ── Portfolio Grid ── -->
    <ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="project in filteredProjects"
        :key="project.title"
        class="group animate-fade-in cursor-pointer"
      >
        <div
          class="relative mbe-4 aspect-4/3 overflow-hidden rounded-2xl border-2 border-glass-border inline-full"
        >
          <img
            :src="project.image"
            :alt="project.title"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 pointer-fine:group-hover:scale-110"
          />
          <!-- Overlay inside CV aesthetic -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-bg/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 pointer-fine:group-hover:opacity-100"
          >
            <div
              class="translate-y-4 transform rounded-full border-2 border-glass-border bg-card p-3 text-blueviolet opacity-0 shadow-2 drop-shadow-lg drop-shadow-blueviolet/50 transition-all duration-300 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.25"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-6"
              >
                <path
                  d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>
            </div>
          </div>
        </div>

        <h3
          class="mbe-1 ml-2 text-base font-medium text-text capitalize text-shadow-black/20 text-shadow-sm md:text-[0.9375rem] lg:text-base"
        >
          {{ project.title }}
        </h3>
        <p class="ml-2 text-[0.8125rem] font-light text-text-muted md:text-[0.75rem] lg:text-sm">
          {{ project.category }}
        </p>
      </li>
    </ul>
  </div>
</template>
