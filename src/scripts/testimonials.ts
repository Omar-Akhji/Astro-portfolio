const setupTestimonials = (): void => {
  const dialog = document.querySelector<HTMLDialogElement>("#testimonial-dialog");
  const closeBtn = document.querySelector<HTMLButtonElement>("#testimonial-close-btn");
  const avatarEl = document.querySelector<HTMLSpanElement>("#dialog-avatar");
  const nameEl = document.querySelector<HTMLHeadingElement>("#dialog-name");
  const dateEl = document.querySelector<HTMLElement>("#dialog-date");
  const textEl = document.querySelector<HTMLParagraphElement>("#dialog-text");
  const list = document.querySelector<HTMLUListElement>("#testimonials-list");

  if (!dialog || !closeBtn || !avatarEl || !nameEl || !dateEl || !textEl || !list) {
    return;
  }

  // Prevent duplicate binding on persisted dialog/list
  if (list.dataset["bound"] === "true") {
    return;
  }
  list.dataset["bound"] = "true";

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

  // Event delegation on the container for cards
  list.addEventListener("click", (e: MouseEvent): void => {
    const target = e.target as HTMLElement | null;
    const card = target?.closest<HTMLElement>(".testimonial-card");
    if (!card) {
      return;
    }
    openTestimonial(card);
  });

  list.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    const target = e.target as HTMLElement | null;
    const card = target?.closest<HTMLElement>(".testimonial-card");
    if (!card) {
      return;
    }

    e.preventDefault();
    openTestimonial(card);
  });
};

document.addEventListener("astro:page-load", setupTestimonials);
