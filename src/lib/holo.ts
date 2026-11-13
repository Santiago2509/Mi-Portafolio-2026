/** Shared, mutable state between the hero (writer) and the page-wide network (reader). */
export const holo = {
  /** 0 = hologram, 1 = fully human. Driven by the hero's pinned scroll. */
  reveal: 0,
  /** Screen position (px) of the centre of the face: origin of the wave. */
  cx: 0,
  cy: 0,
  /** Pixels per portrait-plane unit, and the plane radius the wave reaches at reveal = 1. */
  unit: 0,
  maxR: 1.65,
};
