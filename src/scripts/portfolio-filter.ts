/** Client script for portfolio category filtering and history sync. */

export const setupPortfolioFilter = (): void => {
  const container = document.querySelector<HTMLElement>("#portfolio-filter-container");
  if (!container) {
    return;
  }

  const categoryList = container.querySelector<HTMLUListElement>("#portfolio-category-list");
  const tabs = container.querySelectorAll<HTMLButtonElement>(".portfolio-tab");
  const cards = container.querySelectorAll<HTMLElement>(".portfolio-card");

  const updateFilter = (selectedCategory: string, updateHistory = true): void => {
    if (updateHistory) {
      const params = new URLSearchParams(globalThis.location.search);
      if (selectedCategory === "All") {
        params.delete("category");
      } else {
        params.set("category", selectedCategory);
      }
      const queryString = params.toString();
      const newUrl = `${globalThis.location.pathname}${queryString ? `?${queryString}` : ""}`;
      globalThis.history.pushState({}, "", newUrl);
    }

    tabs.forEach((tab) => {
      const cat = tab.dataset["category"] ?? "";
      const isActive = cat === selectedCategory;

      tab.classList.toggle("text-blueviolet", isActive);
      tab.classList.toggle("text-text-muted", !isActive);
      tab.classList.toggle("hover:text-text", !isActive);
      tab.classList.toggle("cursor-pointer", !isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });

    cards.forEach((card) => {
      const cardCat = card.dataset["projectCategory"];
      const isVisible = selectedCategory === "All" || cardCat === selectedCategory;
      card.classList.toggle("hidden", !isVisible);
    });
  };

  const initialParams = new URLSearchParams(globalThis.location.search);
  const initialCategory = initialParams.get("category") ?? "All";
  updateFilter(initialCategory, false);

  if (!categoryList || categoryList.dataset["bound"] === "true") {
    return;
  }
  categoryList.dataset["bound"] = "true";

  categoryList.addEventListener("click", (e: MouseEvent): void => {
    const target = e.target as HTMLElement | null;
    const tab = target?.closest<HTMLButtonElement>(".portfolio-tab");
    if (!tab) {
      return;
    }
    const category = tab.dataset["category"] ?? "All";
    updateFilter(category, true);
  });
};

document.addEventListener("astro:page-load", setupPortfolioFilter);
