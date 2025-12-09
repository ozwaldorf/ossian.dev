import { crossfade } from "svelte/transition";
import { cubicOut } from "svelte/easing";

export function fadeSlide(node: Element, { delay = 0, duration = 400 } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const height = parseFloat(style.height);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);

  return {
    delay,
    duration,
    easing: cubicOut,
    css: (t: number) => {
      // Slide happens in first half, fade in second half
      const slideT = Math.min(t * 2, 1);
      const fadeT = Math.max((t - 0.5) * 2, 0);
      return `
        opacity: ${fadeT * opacity};
        height: ${slideT * height}px;
        padding-top: ${slideT * paddingTop}px;
        padding-bottom: ${slideT * paddingBottom}px;
        margin-top: ${slideT * marginTop}px;
        margin-bottom: ${slideT * marginBottom}px;
        overflow: hidden;
      `;
    },
  };
}

export function typewriter(node: Node, { speed = 1, delay = 0 }) {
  if (node.childNodes.length !== 1) throw new Error(``);
  if (node.childNodes[0].nodeType !== Node.TEXT_NODE) {
    throw new Error(`Invalid element for typewriter transition`);
  }
  const text = node.textContent || "";
  const duration = text.length / (speed * 0.01);
  return {
    delay,
    duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * t);
      node.textContent = text.slice(0, i);
    },
  };
}

export const [send, receive] = crossfade({
  duration: 500,
});
