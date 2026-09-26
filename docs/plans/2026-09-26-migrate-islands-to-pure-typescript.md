# Migrate All Islands to Pure TypeScript with Astro Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

**Goal:** Completely eliminate all Vue runtime islands and replace them with native Astro components
powered by pure TypeScript and standard web APIs, resulting in zero client framework overhead.

**Architecture:** Migrate all 5 Vue SFC components (`CustomCursor.vue`, `Sidebar.vue`,
`TestimonialsList.vue`, `PortfolioFilter.vue`, `ContactContent.vue`) to `.astro` components with
typed client-side `<script>` modules listening to `astro:page-load` for View Transitions
compatibility. Remove `@astrojs/vue` integration and Vue dependencies from the codebase.

**Tech Stack:** Astro 7.3+, TypeScript 6, Tailwind CSS v4, HTML5 Web APIs (HTMLDialogElement,
History API, FormData, Fetch API).

---

### Task 1: Create Pure TypeScript `CustomCursor.astro`

**Files:**

- Create: `src/components/ui/CustomCursor.astro`

**Step 1: Write `src/components/ui/CustomCursor.astro`**

- Implement cursor dot and cursor ring DOM elements with strict accessibility annotations
  (`aria-hidden="true"`).
- Implement pure TypeScript client script managing RAF animation and mousemove events.

**Step 2: Verify component syntax and structure**

---

### Task 2: Create Pure TypeScript `Sidebar.astro`

**Files:**

- Create: `src/components/layout/Sidebar.astro`

**Step 1: Write `src/components/layout/Sidebar.astro`**

- Typed Astro Props (`initials`, `name`, `title`, `contact`, `languages`).
- Responsive aside markup with expandable contact details and mobile toggle button.
- Pure TypeScript client script hooked to `astro:page-load` managing active/collapsed state,
  chevrons, and accessibility attributes (`aria-expanded`, `aria-label`).

**Step 2: Verify component syntax and structure**

---

### Task 3: Create Pure TypeScript `TestimonialsList.astro`

**Files:**

- Create: `src/components/features/TestimonialsList.astro`

**Step 1: Write `src/components/features/TestimonialsList.astro`**

- Static SSR list of testimonials matching the visual carousel styling.
- Native HTML `<dialog>` element with accessible close button and animated backdrop.
- Pure TypeScript client script reading structured testimonial dataset and driving dialog
  `showModal()` / `close()` and backdrop clicks.

**Step 2: Verify component syntax and structure**

---

### Task 4: Create Pure TypeScript `PortfolioFilter.astro`

**Files:**

- Create: `src/components/features/PortfolioFilter.astro`

**Step 1: Write `src/components/features/PortfolioFilter.astro`**

- Static SSR filter tabs and project grid with category data attributes.
- Pure TypeScript client script managing active tab state, URL search params via
  `history.pushState`, and DOM card visibility with early returns.

**Step 2: Verify component syntax and structure**

---

### Task 5: Create Pure TypeScript `ContactContent.astro`

**Files:**

- Create: `src/components/sections/ContactContent.astro`

**Step 1: Write `src/components/sections/ContactContent.astro`**

- Lazy-loaded Google Maps section.
- Fully accessible form with status alerts, floating validation states, submit spinner, and error
  reporting.
- Pure TypeScript client script handling `FormData` POST to `/api/contact`, type-guarded responses
  via `isContactFormState`, and UI feedback.

**Step 2: Verify component syntax and structure**

---

### Task 6: Update Astro Pages & Layouts to Consume Pure Astro Components

**Files:**

- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/sections/PortfolioContent.astro`
- Modify: `src/components/sections/AboutContent.astro`

_*Step 1: Update imports and remove client:* island directives_*

- Replace `.vue` imports with `.astro`.
- Remove `client:load`, `client:visible`, and `client:only="vue"` directives.

**Step 2: Delete old `.vue` component files**

- Delete: `src/components/ui/CustomCursor.vue`
- Delete: `src/components/layout/Sidebar.vue`
- Delete: `src/components/features/TestimonialsList.vue`
- Delete: `src/components/features/PortfolioFilter.vue`
- Delete: `src/components/sections/ContactContent.vue`

---

### Task 7: Remove Vue Integration & Cleanup Dependencies

**Files:**

- Modify: `astro.config.mjs`
- Modify: `package.json`
- Modify: `eslint.config.mjs`

**Step 1: Remove Vue from `astro.config.mjs`**

- Remove `@astrojs/vue` import and invocation from `integrations`.

**Step 2: Remove Vue dependencies and run bun install**

- Remove `@astrojs/vue`, `vue`, `eslint-plugin-vue`, `eslint-plugin-vuejs-accessibility`,
  `vue-eslint-parser`.
- Run: `bun install`

**Step 3: Update `eslint.config.mjs`**

- Remove Vue plugins and Vue-specific rules.

---

### Task 8: Validation & Verification

**Step 1: Run type checking**

- Run: `bun run check`
- Expected: 0 errors.

**Step 2: Run linter**

- Run: `bun run lint`
- Expected: 0 errors.

**Step 3: Run production build**

- Run: `bun run build`
- Expected: Successful build with zero Vue runtime in client chunks.
