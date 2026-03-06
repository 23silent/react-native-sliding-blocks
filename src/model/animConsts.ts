/** Pan gesture multiplier for translateX (higher = more sensitive) */
export const GESTURE_SENSITIVITY = 1.25

/** Splash screen display duration (ms) before navigating to home */
export const SPLASH_DURATION_MS = 1500

/** Animation durations (ms) for engine bridge and item lifecycle */
export const ANIM = {
  COMPLETE_SNAP: 50,
  ITEM_DROP: 200,
  WILL_REMOVE_PULSE: 80,
  REMOVE_FADE: 600,
  GAME_OVER_IN: 250,
  GAME_OVER_OUT: 200
} as const
