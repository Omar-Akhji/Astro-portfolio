const setupSidebar = (): void => {
  const toggleBtn = document.querySelector<HTMLButtonElement>("#sidebar-toggle-btn");
  const aside = document.querySelector<HTMLElement>("#sidebar-aside");
  const details = document.querySelector<HTMLElement>("#sidebar-details");
  const toggleLabel = document.querySelector<HTMLElement>("#sidebar-toggle-label");
  const iconUp = document.querySelector<SVGElement>("#sidebar-icon-up");
  const iconDown = document.querySelector<SVGElement>("#sidebar-icon-down");

  if (!toggleBtn || !aside || !details || !toggleLabel || !iconUp || !iconDown) {
    return;
  }

  // Prevent duplicate listener registration if button element is persisted
  if (toggleBtn.dataset["bound"] === "true") {
    return;
  }
  toggleBtn.dataset["bound"] = "true";

  const toggleSidebar = (): void => {
    // Read state from DOM directly for deterministic synchronization
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;

    toggleBtn.setAttribute("aria-expanded", String(nextState));
    toggleBtn.setAttribute("aria-label", nextState ? "Hide Contacts" : "Show Contacts");
    toggleLabel.textContent = nextState ? "Hide Contacts" : "Show Contacts";

    if (nextState) {
      aside.classList.remove("max-block-32", "sm:max-block-48");
      aside.classList.add("max-block-375");

      details.classList.remove("invisible", "opacity-0");
      details.classList.add("visible", "opacity-100");

      iconUp.classList.remove("hidden");
      iconDown.classList.add("hidden");
    } else {
      aside.classList.remove("max-block-375");
      aside.classList.add("max-block-32", "sm:max-block-48");

      details.classList.remove("visible", "opacity-100");
      details.classList.add("invisible", "opacity-0");

      iconUp.classList.add("hidden");
      iconDown.classList.remove("hidden");
    }
  };

  toggleBtn.addEventListener("click", toggleSidebar);
};

document.addEventListener("astro:page-load", setupSidebar);
