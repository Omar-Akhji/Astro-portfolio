// Client-side script to handle skeleton displays during view transitions

// Listen for transition preparation (navigation start, before content is fetched)
document.addEventListener("astro:before-preparation", (event) => {
  const toPath = event.to.pathname;
  const container = document.querySelector<HTMLElement>("#skeleton-container");
  const content = document.querySelector<HTMLElement>("#page-content");
  if (!container || !content) return;

  // Normalize path to match data-skeleton attributes (remove trailing slash)
  const targetPath = toPath === "/" ? "/" : toPath.replace(/\/$/, "");

  const targetSkeleton = container.querySelector<HTMLElement>(
    `[data-skeleton="${CSS.escape(targetPath)}"]`,
  );
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
