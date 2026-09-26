let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
let rafId: number | null = null;
let isListenerAttached = false;
let dotElement: HTMLDivElement | null = null;
let ringElement: HTMLDivElement | null = null;

const onMouseMove = (e: MouseEvent): void => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dotElement) {
    dotElement.style.transform = `translate3d(${String(mouseX)}px, ${String(mouseY)}px, 0) translate(-50%, -50%)`;
  }
};

const animRing = (): void => {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;

  if (ringElement) {
    ringElement.style.transform = `translate3d(${String(ringX)}px, ${String(ringY)}px, 0) translate(-50%, -50%)`;
  }

  rafId = requestAnimationFrame(animRing);
};

const initCustomCursor = (): void => {
  // Only activate on fine pointer devices (e.g. mouse), avoiding wasted RAF loops on touchscreens
  if (typeof globalThis === "undefined" || !globalThis.matchMedia("(pointer: fine)").matches) {
    return;
  }

  dotElement = document.querySelector<HTMLDivElement>("#cursor-dot");
  ringElement = document.querySelector<HTMLDivElement>("#cursor-ring");

  if (!dotElement || !ringElement) {
    return;
  }

  if (!isListenerAttached) {
    globalThis.addEventListener("mousemove", onMouseMove, { passive: true });
    isListenerAttached = true;
  }

  if (rafId === null) {
    rafId = requestAnimationFrame(animRing);
  }
};

document.addEventListener("astro:page-load", initCustomCursor);
