/** Client script for portfolio category filtering and history sync. */

export const setupPortfolioFilter = (): void => {
  const container = document.querySelector<HTMLElement>("#portfolio-filter-container");
  if (!container) {
    return;
  }

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
      if (cat === selectedCategory) {
        tab.className =
          "portfolio-tab text-sm font-medium transition-colors sm:text-[0.9375rem] text-blueviolet";
      } else {
        tab.className =
          "portfolio-tab text-sm font-medium transition-colors sm:text-[0.9375rem] cursor-pointer text-text-muted hover:text-text";
      }
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

  tabs.forEach((tab) => {
    tab.addEventListener("click", (): void => {
      const category = tab.dataset["category"] ?? "All";
      updateFilter(category, true);
    });
  });
};

document.addEventListener("astro:page-load", setupPortfolioFilter);
