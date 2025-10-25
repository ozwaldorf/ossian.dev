import { crossfade } from "svelte/transition";

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
