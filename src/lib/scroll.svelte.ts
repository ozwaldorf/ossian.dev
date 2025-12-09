import { tweened } from "svelte/motion";
import { cubicOut } from "svelte/easing";

// Position types
export type ElementPositions = {
  profile: DOMRect;
  name: DOMRect;
  title: DOMRect;
  homeLink: DOMRect;
  codeLink: DOMRect;
  musicLink: DOMRect;
};

// Raw scroll state using Svelte 5 runes
export const scrollState = $state({
  scrollY: 0,
  heroProgress: 0, // 0 (top) to 1 (hero scrolled away) - raw value
  currentSection: "hero" as "hero" | "code" | "music",
  introComplete: false,
});

// Position callbacks - set by Header and Hero
export const positionGetters = $state({
  getHeaderPositions: null as (() => ElementPositions | null) | null,
  getHeroPositions: null as (() => ElementPositions | null) | null,
});

// Tweened progress for smooth animations - use this for positions
export const morphProgress = tweened(0, { duration: 150, easing: cubicOut });

// Tweened morph values for smooth animation
export const profileSize = tweened(160, { duration: 150, easing: cubicOut });
export const nameSize = tweened(2.5, { duration: 150, easing: cubicOut });
export const titleSize = tweened(1.5, { duration: 150, easing: cubicOut });
export const headerOpacity = tweened(0, { duration: 150, easing: cubicOut });

// Update tweened values based on hero progress
export function updateMorphValues(progress: number, instant = false) {
  const opts = instant ? { duration: 0 } : undefined;
  morphProgress.set(progress, opts);
  profileSize.set(160 - 110 * progress, opts); // 160px → 50px
  nameSize.set(2.5 - 1.25 * progress, opts); // 2.5rem → 1.25rem
  titleSize.set(1.5 - 0.5 * progress, opts); // 1.5rem → 1rem
  headerOpacity.set(progress, opts); // 0 → 1
}
