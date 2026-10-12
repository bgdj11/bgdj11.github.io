import type { World } from '../data/portfolio'

// Created once for this page load, outside React's mount cycle. Refreshing the
// page creates a new world; scrolling, resizing and StrictMode keep this one.
const entropy = new Uint32Array(5)
globalThis.crypto.getRandomValues(entropy)
export const worldSeeds: Record<World, number> = {
  universe: entropy[0], sky: entropy[1], mountains: entropy[2],
  botanical: entropy[3], underwater: entropy[4],
}
