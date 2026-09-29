import type { TransitionBeforePreparationEvent } from "astro:transitions/client";
import { wait } from "../lib/wait.ts";

const SKELETON_DEV_DELAY_MS = 600;

function isPreparationEvent(event: Event): event is TransitionBeforePreparationEvent {
  return "to" in event && event.to instanceof URL;
}

/**
 * Resolves an arbitrary navigation pathname to the matching skeleton key. Pure function separated
 * from DOM manipulation for testability and clarity.
 */
export function resolveSkeletonRoute(pathname: string): string {
  const target = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const lower = target.toLowerCase();

  if (lower.startsWith("/blog")) return "/blog";
  if (lower.startsWith("/resume")) return "/resume";
  if (lower.startsWith("/projects")) return "/projects";
  if (lower.startsWith("/contact")) return "/contact";

  return target;
}

// Client-side script to handle skeleton displays during view transitions
document.addEventListener("astro:before-preparation", (e: Event) => {
  if (!isPreparationEvent(e)) return;

  // In development mode, delay page loader so skeleton transition is visible
  if (import.meta.env.DEV) {
    const originalLoader = e.loader;
    e.loader = async () => {
      await Promise.all([originalLoader(), wait(SKELETON_DEV_DELAY_MS)]);
    };
  }

  const toPath = e.to.pathname;
  const container = document.querySelector<HTMLElement>("#skeleton-container");
  const content = document.querySelector<HTMLElement>("#page-content");
  if (!container || !content) return;

  // Normalize path to match data-skeleton attributes (remove trailing slash except root)
  const targetPath = toPath === "/" ? "/" : toPath.replace(/\/$/, "");

  // 1. Try exact match first
  let targetSkeleton = container.querySelector<HTMLElement>(
    `[data-skeleton="${CSS.escape(targetPath)}"]`,
  );

  // 2. Specialized pattern matching for dynamic routes (e.g. /blog/[id])
  if (!targetSkeleton) {
    const resolvedKey = resolveSkeletonRoute(targetPath);
    targetSkeleton = container.querySelector<HTMLElement>(
      `[data-skeleton="${CSS.escape(resolvedKey)}"]`,
    );
  }

  if (!targetSkeleton) {
    return;
  }

  // Hide all skeletons inside first
  container.querySelectorAll<HTMLElement>("[data-skeleton]").forEach((el) => {
    el.classList.add("hidden");
  });
  // Show the targeted skeleton
  targetSkeleton.classList.remove("hidden");
  // Show container, hide current page content
  container.classList.remove("hidden");
  container.removeAttribute("aria-hidden");
  content.classList.add("hidden");
});

// Ensure that on swap or page load, the skeleton container is hidden and actual content is shown.
document.addEventListener("astro:after-swap", () => {
  const container = document.querySelector<HTMLElement>("#skeleton-container");
  const content = document.querySelector<HTMLElement>("#page-content");
  if (!(container && content)) {
    return;
  }

  container.classList.add("hidden");
  container.setAttribute("aria-hidden", "true");
  content.classList.remove("hidden");
});
