# Architectural Specification: Modular Feature-Based Architecture

**Date**: 2026-09-27  
**Status**: Accepted  
**Project**: Omar Akhji Developer Portfolio (`Astro-portfolio`)

---

## 1. Understanding Summary

* **Objective**: Refactor the codebase from a layer-based structure (`components/`, `data/`, `scripts/`, `types/`) into a **modular, feature-based vertical slice architecture** (`src/features/*` and `src/shared/*`).
* **Motivation**: Improve domain cohesion, reduce context-switching across disparate directories, and allow features to be isolated, developed, or scaled independently.
* **Scope**:
  * Create domain slices for `about`, `resume`, `portfolio`, `blog`, and `contact`.
  * Colocate components, local data files, client scripts, and domain TypeScript types within each feature slice.
  * Establish `src/shared/` for cross-cutting layout, UI atoms, icons, global scripts, helper utilities, and root layouts.
  * Retain Astro file-based routing in `src/pages/` as thin orchestrators.
  * Update Astro Content Collections loaders in `src/content.config.ts`.
  * Configure TypeScript path aliases in `tsconfig.json`.
* **Explicit Non-Goals**:
  * No visual redesign or styling changes.
  * No change to public URLs or API route contracts (`/api/contact`).
  * No additional external dependencies.

---

## 2. Assumptions & Constraints

1. **Tooling**: Strictly use **Bun** for all installations, scripts, and checks (`bun run check`, `bun run lint`, `bun run build`).
2. **TypeScript Strictness**: Preserve TS6 strict configuration with `verbatimModuleSyntax: true` and `noEmit: true`.
3. **Content Collections**: The loaders in `src/content.config.ts` support `file(...)` paths pointing into feature folders (`src/features/<feature>/data/*.json`).
4. **Shared Profile**: `resumeData.json` contains global personal info utilized across the layout and sidebar; it lives in `src/shared/data/resumeData.json`.

---

## 3. Decision Log

| Decision | Alternatives Considered | Rationale |
| :--- | :--- | :--- |
| **Approach 1: Feature Folders with Shared Core** | Approach 2: Full Vertical Slices with server colocation<br>Approach 3: Component-only grouping | Balances high domain cohesion for client UI, scripts, and data while keeping Hono server routing and Astro page routing declarative and straightforward. |
| **Colocated Feature Data** | Centralized `src/data/` | Users preferred grouping domain data with the feature (e.g. `src/features/about/data/services.json`) for true self-contained modules. |
| **Resume Section Extraction** | Leaving inline layout in `pages/resume.astro` | Extracting `ResumeContent.astro` into `src/features/resume/components/` normalizes all pages in `src/pages/` to thin composition files. |

---

## 4. Final Architecture & Directory Layout

```text
src/
├── features/
│   ├── about/
│   │   ├── components/
│   │   │   ├── AboutContent.astro
│   │   │   ├── AboutSkeleton.astro
│   │   │   ├── ClientsList.astro
│   │   │   └── TestimonialsList.astro
│   │   ├── data/
│   │   │   ├── clients.json
│   │   │   ├── languages.json
│   │   │   ├── services.json
│   │   │   └── testimonials.json
│   │   ├── scripts/
│   │   │   └── testimonials.ts
│   │   └── types.ts
│   ├── resume/
│   │   ├── components/
│   │   │   ├── ResumeContent.astro
│   │   │   └── ResumeSkeleton.astro
│   │   ├── data/
│   │   │   ├── education.json
│   │   │   ├── experience.json
│   │   │   └── skills.json
│   │   └── types.ts
│   ├── portfolio/
│   │   ├── components/
│   │   │   ├── PortfolioContent.astro
│   │   │   ├── PortfolioFilter.astro
│   │   │   └── PortfolioSkeleton.astro
│   │   ├── scripts/
│   │   │   └── portfolio-filter.ts
│   │   └── types.ts
│   ├── blog/
│   │   ├── components/
│   │   │   └── BlogSkeleton.astro
│   │   └── types.ts
│   └── contact/
│       ├── components/
│       │   ├── ContactContent.astro
│       │   └── ContactSkeleton.astro
│       ├── scripts/
│       │   └── contact.ts
│       └── types.ts
├── shared/
│   ├── components/
│   │   ├── icons/
│   │   │   ├── AwardIcon.astro
│   │   │   ├── BriefcaseIcon.astro
│   │   │   ├── CameraIcon.astro
│   │   │   ├── FileCodeIcon.astro
│   │   │   ├── GraduationCapIcon.astro
│   │   │   ├── LayoutDashboardIcon.astro
│   │   │   ├── MonitorIcon.astro
│   │   │   └── TerminalIcon.astro
│   │   ├── layout/
│   │   │   ├── Footer.astro
│   │   │   ├── Navbar.astro
│   │   │   └── Sidebar.astro
│   │   └── ui/
│   │       ├── CustomCursor.astro
│   │       ├── PageWrapper.astro
│   │       └── SectionTitle.astro
│   ├── data/
│   │   └── resumeData.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── wait.ts
│   └── scripts/
│       ├── cursor.ts
│       ├── sidebar.ts
│       └── transitions.ts
├── content/
│   ├── blog/
│   └── projects/
├── pages/
│   ├── api/
│   │   └── [...path].ts
│   ├── blog/
│   │   └── [id].astro
│   ├── blog.astro
│   ├── contact.astro
│   ├── index.astro
│   ├── portfolio.astro
│   └── resume.astro
├── server/
│   ├── routes/
│   │   └── contact.ts
│   ├── app.ts
│   └── mailer.ts
├── styles/
│   └── globals.css
└── content.config.ts
```

---

## 5. Implementation & Verification Plan

1. **Path Aliases**:
   * Add `@features/*` -> `./src/features/*` and `@shared/*` -> `./src/shared/*` in `tsconfig.json`.
2. **Move & Organize Shared Elements**:
   * Scaffold `src/shared/{components,data,layouts,lib,scripts}`.
   * Relocate icons, layout components, ui atoms, global scripts, `wait.ts`, `Layout.astro`, and `resumeData.json`.
3. **Move & Organize Feature Domains**:
   * Scaffold `src/features/{about,resume,portfolio,blog,contact}` with subdirectories.
   * Move components, data, scripts, and types to their respective feature folders.
   * Extract `ResumeContent.astro` from `src/pages/resume.astro`.
4. **Update Imports & References**:
   * Update `src/content.config.ts` loaders.
   * Update `src/layouts/Layout.astro` and all pages in `src/pages/`.
   * Update references in scripts and components.
   * Clean up empty folders.
5. **Quality Gate Execution**:
   * `bun run astro sync`
   * `bun run check`
   * `bun run lint`
   * `bun run build`
