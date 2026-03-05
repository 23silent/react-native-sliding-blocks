/** Pan gesture multiplier for translateX (higher = more sensitive) */
export const GESTURE_SENSITIVITY = 1.25

/** Animation durations (ms) for engine bridge and item lifecycle */
export const ANIM = {
  COMPLETE_SNAP: 50,
  ITEM_DROP: 200,
  WILL_REMOVE_PULSE: 80,
  REMOVE_FADE: 400,
  GAME_OVER_IN: 250,
  GAME_OVER_OUT: 200
} as const
