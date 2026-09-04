import { create } from "zustand";

/**
 * The 2026-edition transition. Triggering it plays the black-hole transition
 * video full-screen, then lands on the next-edition site (planned later). The
 * asset is pre-processed: already trimmed to the 3s→end segment and zoom-cropped
 * to remove the source watermark, so the player just autoplays it.
 */
export const TRANSITION_SRC = "/blackhole-transition.mp4";
export const NEXT_EDITION_PATH = "/2026";

interface TransitionState {
  active: boolean;
  start: () => void;
  stop: () => void;
}

export const useTransition = create<TransitionState>((set) => ({
  active: false,
  start: () => set({ active: true }),
  stop: () => set({ active: false }),
}));
