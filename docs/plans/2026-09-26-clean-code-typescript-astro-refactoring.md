# Clean Code, TypeScript Best Practices & Astro Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

**Goal:** Refactor the codebase to eliminate code smells, align TypeScript library configuration for
universal editor and CLI compatibility, optimize client-side script performance across Astro view
transitions, and unify type definitions to follow Clean Code and TypeScript best practices.

**Architecture:**

1. **Type Environment & Standard Library:** Align `tsconfig.json` and `src/env.d.ts` so ECMAScript
   standard library declarations (including ES2023 `Array.prototype.toSorted`) are recognized
   universally by all IDE language servers (VS Code / Cursor / Astro LS) and the Bun runtime CLI
   without requiring workarounds or lint disables.
2. **Component & Frontmatter Clean Code:** Replace the quadratic-time insertion-sort `reduce` hack
   in `AboutContent.astro` with idiomatic, immutable `.toSorted()`. Refactor service icon mapping to
   use robust entity identifiers rather than localized display strings.
3. **Client-Side Script Hardening:** Eliminate performance anti-patterns in client-side TypeScript
   (such as continuous DOM queries in `requestAnimationFrame` and `mousemove` in `cursor.ts`), adopt
   DOM-driven state management in `sidebar.ts`, and guard against event listener leaks across Astro
   View Transition lifecycle events (`astro:page-load`).
4. **Type Architecture (DRY):** Align domain interfaces in `src/types/` with Astro content
   collection schemas generated from `content.config.ts`.

**Tech Stack:** Astro 7.3+, TypeScript 6, Bun runtime, Tailwind CSS v4, ESLint (Flat Config +
Unicorn + Security).

---

### Task 1: Fix TypeScript Standard Library Configuration for Universal Editor Support

**Files:**

- Modify: `tsconfig.json:18-24`
- Modify: `src/env.d.ts:1-3`

**Step 1: Update `tsconfig.json` to include recognized ES libraries**

In `tsconfig.json`, change:

```json
    // ─── Target & Lib ──────────────────────────────────────────────────────
    // TS6 defaults to ES2025 but explicit is clearer
    "target": "ES2025",
    "lib": ["ES2025", "DOM", "DOM.Iterable"],
    "ignoreDeprecations": "6.0",
```

To:

```json
    // ─── Target & Lib ──────────────────────────────────────────────────────
    "target": "ESNext",
    "lib": ["ES2023", "ESNext", "DOM", "DOM.Iterable"],
    "ignoreDeprecations": "6.0",
```

_Rationale:_ External IDE language servers (like VS Code's built-in TypeScript 5.x) do not know
`"ES2025"`. When encountering an unknown lib token, they fall back to ES5, dropping
`Array.prototype.toSorted` and producing editor errors. Supplying `"ES2023"` and `"ESNext"`
guarantees full compatibility across both IDEs and Bun.

**Step 2: Add ambient standard library reference in `src/env.d.ts`**

Add standard library directives to `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />
/// <reference lib="es2023.array" />
/// <reference lib="esnext" />
```

_Rationale:_ Provides defense-in-depth so any ambient Astro language server instance immediately
recognizes `toSorted()` on array instances.

**Step 3: Run type check to verify**

Run:

```bash
bun run check
```

Expected output: `0 errors, 0 warnings, 0 hints`.

**Step 4: Commit**

```bash
git add tsconfig.json src/env.d.ts
git commit -m "fix(types): configure universal ES2023 and ESNext library declarations for IDE and CLI"
```

---

### Task 2: Clean Code Refactoring in `AboutContent.astro`

**Files:**

- Modify: `src/components/sections/AboutContent.astro:20-41`
- Modify: `src/components/sections/AboutContent.astro:72-96`

**Step 1: Replace insertion-sort reduce with clean immutable `toSorted()`**

Replace lines 20-30:

```typescript
const languages: CollectionEntry<"languages">[] = rawLanguages.reduce<
  CollectionEntry<"languages">[]
>((sorted, item) => {
  const targetIndex = sorted.findIndex(
    (current) => (current.data.order ?? 0) > (item.data.order ?? 0),
  );
  if (targetIndex === -1) {
    return [...sorted, item];
  }
  return [...sorted.slice(0, targetIndex), item, ...sorted.slice(targetIndex)];
}, []);
```

With the idiomatic, single-responsibility Clean Code solution:

```typescript
const languages: CollectionEntry<"languages">[] = rawLanguages.toSorted(
  (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0),
);
```

**Step 2: Refactor `serviceIcons` mapping to use service IDs**

In `src/components/sections/AboutContent.astro`:

```typescript
type IconComponent = typeof TerminalIcon;

const serviceIcons: Readonly<Record<string, IconComponent>> = {
  "graphic-design": LayoutDashboardIcon,
  "web-development": MonitorIcon,
  "data-science": FileCodeIcon,
  "photography-montage": CameraIcon,
};
```

And in template:

```astro
const Icon = serviceIcons[service.id] ?? TerminalIcon;
```

_Rationale:_ Loose coupling. Service IDs in `services.json` (`graphic-design`, `web-development`,
etc.) are stable machine keys, whereas titles are user-facing strings subject to copywriting
changes.

**Step 3: Verify formatting and linter**

Run:

```bash
bun run lint
bun run check
```

Expected output: Both commands exit with code 0 (zero errors, zero warnings, no `eslint-disable`
comments).

**Step 4: Commit**

```bash
git add src/components/sections/AboutContent.astro
git commit -m "refactor(about): use idiomatic toSorted and id-based service icon mapping"
```

---

### Task 3: Performance & Lifecycle Optimization for Client Scripts

**Files:**

- Modify: `src/scripts/cursor.ts`
- Modify: `src/scripts/sidebar.ts`
- Modify: `src/scripts/testimonials.ts`
- Modify: `src/scripts/portfolio-filter.ts`

**Step 1: Optimize `src/scripts/cursor.ts`**

1. Cache `#cursor-dot` and `#cursor-ring` DOM references instead of querying
   `document.querySelector` on every `mousemove` and inside every `requestAnimationFrame` tick.
2. Only run cursor animation if `window.matchMedia("(pointer: fine)").matches` is true.
3. Cleanly reconnect references upon `astro:page-load`.

**Step 2: Make `src/scripts/sidebar.ts` state DOM-driven**

Instead of holding local `isActive` state that can become desynchronized upon Astro View Transition
swaps:

```typescript
const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
const nextState = !isExpanded;
toggleBtn.setAttribute("aria-expanded", String(nextState));
// update UI classes according to nextState
```

**Step 3: Add event delegation to `src/scripts/testimonials.ts`**

Attach a single click listener to the testimonials container using event delegation
(`event.target.closest<HTMLElement>(".testimonial-card")`) rather than iterating and attaching
separate listeners to every card on every page load.

**Step 4: Refactor `portfolio-filter.ts` tab styling**

Use `classList.toggle()` or data attributes (`data-active`) instead of overwriting the full
`className` string.

**Step 5: Verify tests and linting**

Run:

```bash
bun run lint
bun run check
```

Expected output: 0 errors.

**Step 6: Commit**

```bash
git add src/scripts/cursor.ts src/scripts/sidebar.ts src/scripts/testimonials.ts src/scripts/portfolio-filter.ts
git commit -m "perf(scripts): cache cursor dom queries, make sidebar state dom-driven, and use event delegation"
```

---

### Task 4: Unify Type Architecture with Astro Content Collections (DRY)

**Files:**

- Modify: `src/types/portfolio.ts`
- Modify: `src/types/resume.ts`

**Step 1: Align domain interfaces with `CollectionEntry` schemas**

Export helper types derived from Astro collections or ensure `Testimonial`, `Service`, `Project`,
etc. accurately mirror the validated schema output from `src/content.config.ts`.

**Step 2: Verify type check and build**

Run:

```bash
bun run check
```

Expected output: 0 errors.

**Step 3: Commit**

```bash
git add src/types/
git commit -m "refactor(types): unify domain types with Astro content collection schema definitions"
```

---

### Task 5: End-to-End Build and Audit Verification

**Files:**

- All modified files

**Step 1: Run format check** Run:

```bash
bun run format:check
```

**Step 2: Run linter** Run:

```bash
bun run lint
```

**Step 3: Run Astro and TypeScript diagnostics** Run:

```bash
bun run check
```

**Step 4: Run production build** Run:

```bash
bun run build
```

Expected output: Complete build artifact successfully generated in `dist/`.

---
