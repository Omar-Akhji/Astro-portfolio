# Pure Astro + TypeScript with Hono & Nodemailer Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

**Goal:** Transform the portfolio into a pure Astro and TypeScript architecture with zero
client-side framework runtime, powered by a typed Hono.js backend service utilizing Nodemailer for
SMTP email dispatch.

**Architecture:**

1. **Frontend:** Replace all 5 Vue SFC islands (`CustomCursor`, `Sidebar`, `TestimonialsList`,
   `PortfolioFilter`, `ContactContent`) with native `.astro` components using zero framework JS,
   standard Web APIs (HTMLDialogElement, History API, requestAnimationFrame), and type-safe
   client-side `<script>` tags integrated with Astro's `<ClientRouter />` (`astro:page-load`).
   Remove `@astrojs/vue` and all Vue dependencies.
2. **Backend:** Scaffold a modular, production-grade Hono backend under `src/server/` with route
   grouping, error handling, CORS, and Zod validation. Create a Nodemailer service with SMTP
   configuration and HTML email templating. Mount Hono into Astro's endpoint router
   (`src/pages/api/[...path].ts`) via `app.fetch(request)`.

**Tech Stack:** Astro 7.3+, TypeScript 6, Tailwind CSS v4, Hono 4+, Nodemailer 6+, Zod, Bun runtime.

---

### Task 1: Install Hono, Nodemailer, and Clean Vue Dependencies

**Files:**

- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `eslint.config.mjs`

**Step 1: Install Backend Packages via Bun** Run:

```bash
bun add hono nodemailer @hono/zod-validator
bun add -d @types/nodemailer
```

**Step 2: Remove Vue Dependencies from `package.json`** Remove:

- `@astrojs/vue`
- `vue`
- `eslint-plugin-vue`
- `eslint-plugin-vuejs-accessibility`
- `vue-eslint-parser`

Run:

```bash
bun install
```

**Step 3: Update `astro.config.mjs`** Remove `@astrojs/vue` integration so integrations is
`[mdx()]`.

**Step 4: Update `eslint.config.mjs`** Remove Vue ESLint configs, parser, and rules. Retain Astro,
TypeScript, Unicorn, and Security configs.

---

### Task 2: Build the Nodemailer Service & Environment Configuration

**Files:**

- Create: `src/server/mailer.ts`
- Modify: `src/env.d.ts`
- Modify: `.env.example`

**Step 1: Define Environment Variables in `.env.example` and `src/env.d.ts`** Add SMTP configuration
keys:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=password
CONTACT_TO_EMAIL=omar@example.com
CONTACT_FROM_EMAIL=portfolio@example.com
```

**Step 2: Implement `src/server/mailer.ts`**

- Create reusable `nodemailer.createTransport()` with pooling.
- Provide a typed `sendContactEmail({ fullname, email, message })` function.
- Render clean, responsive HTML email matching the existing aesthetic.
- Include graceful fallback logging when running in local development without SMTP credentials.

---

### Task 3: Build the Hono Backend Application

**Files:**

- Create: `src/server/app.ts`
- Create: `src/server/routes/contact.ts`
- Create: `src/pages/api/[...path].ts`
- Remove: `src/pages/api/contact.ts`

**Step 1: Implement `src/server/routes/contact.ts`**

- Define Zod schema for input validation (`fullname`, `email`, `message`).
- Validate incoming payload with early error responses conforming to `ContactFormState`.
- Call `sendContactEmail()`.
- Return typed JSON response:
  - Success: `{ success: true, message: "Message sent successfully! I'll get back to you soon." }`
  - Error: `{ success: false, message: "...", errors?: { ... } }`

**Step 2: Implement `src/server/app.ts`**

- Instantiate `new Hono().basePath('/api')`.
- Add logger, CORS, and custom error middleware.
- Mount `/contact` route.
- Export `app` and `type AppType = typeof app`.

**Step 3: Connect Hono to Astro via `src/pages/api/[...path].ts`**

```ts
import type { APIRoute } from "astro";
import app from "@/server/app";

export const prerender = false;

export const ALL: APIRoute = ({ request }) => {
  return app.fetch(request);
};
```

---

### Task 4: Migrate Islands to Pure Astro & TypeScript

**Files:**

- Create: `src/components/ui/CustomCursor.astro`
- Create: `src/components/layout/Sidebar.astro`
- Create: `src/components/features/TestimonialsList.astro`
- Create: `src/components/features/PortfolioFilter.astro`
- Create: `src/components/sections/ContactContent.astro`
- Delete: `src/components/ui/CustomCursor.vue`
- Delete: `src/components/layout/Sidebar.vue`
- Delete: `src/components/features/TestimonialsList.vue`
- Delete: `src/components/features/PortfolioFilter.vue`
- Delete: `src/components/sections/ContactContent.vue`

**Component Specifications:**

1. **`CustomCursor.astro`**:
   - Elements: `#cursor-dot` and `#cursor-ring` with `aria-hidden="true"`.
   - Script: Pure TypeScript mouse position tracking and RAF smooth interpolation, initialized on
     `astro:page-load`.
2. **`Sidebar.astro`**:
   - SSR: Profile avatar, name, title, contact list, and languages list rendered statically.
   - Script: Toggle button listener toggling container max-height and opacity classes, updating
     `aria-expanded` and SVG chevrons.
3. **`TestimonialsList.astro`**:
   - SSR: Carousel list of cards with initial letter avatar, name, date, and quote snippet.
   - Script: Testimonial details rendered into native HTML `<dialog id="testimonial-dialog">` via
     `showModal()` and `close()`.
4. **`PortfolioFilter.astro`**:
   - SSR: Category filter pills and complete grid of projects with `data-project-category`.
   - Script: Syncs active category with URL search param (`?category=...`), updates tab classes, and
     filters card display with early return guards.
5. **`ContactContent.astro`**:
   - SSR: On-demand map loader button + form with full name, email, and message inputs.
   - Script: Client-side TypeScript `fetch("/api/contact", ...)` submittal, inline field validation
     error indicators, spinner button state, and status alert banner.

---

### Task 5: Update Astro Pages & Layouts

**Files:**

- Modify: `src/layouts/Layout.astro` (update `CustomCursor` and `Sidebar` imports; remove client
  directives)
- Modify: `src/pages/contact.astro` (update `ContactContent` import; remove `client:load`)
- Modify: `src/components/sections/PortfolioContent.astro` (update `PortfolioFilter` import; remove
  `client:load`)
- Modify: `src/components/sections/AboutContent.astro` (update `TestimonialsList` import; remove
  `client:visible`)

---

### Task 6: Verification and Quality Checks

**Step 1: Check Astro and TypeScript diagnostics** Run: `bun run check` Expected: 0 errors, 0
warnings.

**Step 2: Run ESLint strict checks** Run: `bun run lint` Expected: 0 errors.

**Step 3: Run full Astro build** Run: `bun run build` Expected: Successful build with zero Vue
runtime in client chunks.
