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

  let isActive = false;

  const toggleSidebar = (): void => {
    isActive = !isActive;
    toggleBtn.setAttribute("aria-expanded", String(isActive));
    toggleBtn.setAttribute("aria-label", isActive ? "Hide Contacts" : "Show Contacts");
    toggleLabel.textContent = isActive ? "Hide Contacts" : "Show Contacts";

    if (isActive) {
      aside.classList.remove("max-block-28", "sm:max-block-45");
      aside.classList.add("max-block-375");

      details.classList.remove("invisible", "opacity-0");
      details.classList.add("visible", "opacity-100");

      iconUp.classList.remove("hidden");
      iconDown.classList.add("hidden");
    } else {
      aside.classList.remove("max-block-375");
      aside.classList.add("max-block-28", "sm:max-block-45");

      details.classList.remove("visible", "opacity-100");
      details.classList.add("invisible", "opacity-0");

      iconUp.classList.add("hidden");
      iconDown.classList.remove("hidden");
    }
  };

  toggleBtn.addEventListener("click", toggleSidebar);
};

document.addEventListener("astro:page-load", setupSidebar);
