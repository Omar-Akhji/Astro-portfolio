let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
let isInitialized = false;

const initCustomCursor = (): void => {
  const dot = document.querySelector<HTMLDivElement>("#cursor-dot");
  const ring = document.querySelector<HTMLDivElement>("#cursor-ring");

  if (!dot || !ring || isInitialized) {
    return;
  }

  globalThis.addEventListener("mousemove", (e: MouseEvent): void => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const currentDot = document.querySelector<HTMLDivElement>("#cursor-dot");
    if (currentDot) {
      currentDot.style.transform = `translate3d(${String(mouseX)}px, ${String(mouseY)}px, 0) translate(-50%, -50%)`;
    }
  });

  const animRing = (): void => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;

    const currentRing = document.querySelector<HTMLDivElement>("#cursor-ring");
    if (currentRing) {
      currentRing.style.transform = `translate3d(${String(ringX)}px, ${String(ringY)}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animRing);
  };

  requestAnimationFrame(animRing);
  isInitialized = true;
};

document.addEventListener("astro:page-load", initCustomCursor);
