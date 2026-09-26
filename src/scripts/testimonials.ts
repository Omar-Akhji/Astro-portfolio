const setupTestimonials = (): void => {
  const dialog = document.querySelector<HTMLDialogElement>("#testimonial-dialog");
  const closeBtn = document.querySelector<HTMLButtonElement>("#testimonial-close-btn");
  const avatarEl = document.querySelector<HTMLSpanElement>("#dialog-avatar");
  const nameEl = document.querySelector<HTMLHeadingElement>("#dialog-name");
  const dateEl = document.querySelector<HTMLElement>("#dialog-date");
  const textEl = document.querySelector<HTMLParagraphElement>("#dialog-text");

  if (!dialog || !closeBtn || !avatarEl || !nameEl || !dateEl || !textEl) {
    return;
  }

  const openTestimonial = (card: HTMLElement): void => {
    const name = card.dataset["name"] ?? "";
    const date = card.dataset["date"] ?? "";
    const text = card.dataset["text"] ?? "";

    avatarEl.textContent = name.charAt(0);
    nameEl.textContent = name;
    dateEl.textContent = date;
    textEl.textContent = text;

    if (!dialog.open) {
      dialog.showModal();
    }
  };

  const closeTestimonial = (): void => {
    if (!dialog.open) {
      return;
    }
    dialog.close();
  };

  closeBtn.addEventListener("click", closeTestimonial);

  dialog.addEventListener("click", (e: MouseEvent): void => {
    if (e.target !== dialog) {
      return;
    }
    closeTestimonial();
  });

  const cards = document.querySelectorAll<HTMLElement>(".testimonial-card");
  cards.forEach((card) => {
    card.addEventListener("click", (): void => {
      openTestimonial(card);
    });

    card.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (e.key !== "Enter" && e.key !== " ") {
        return;
      }

      e.preventDefault();
      openTestimonial(card);
    });
  });
};

document.addEventListener("astro:page-load", setupTestimonials);
