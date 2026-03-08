/** Animation durations (ms) - default values. Use settings.animations for overrides. */
export const ANIM = {
  COMPLETE_SNAP: 50,
  ITEM_DROP: 200,
  WILL_REMOVE_PULSE: 80,
  REMOVE_FADE: 600,
  GAME_OVER_IN: 250,
  GAME_OVER_OUT: 200
} as const

/** Animation config used by engine for step-complete timeouts. */
export type AnimConfig = {
  removeFadeMs: number
  itemDropMs: number
}
