/**
 * Centralized layout constants for UI hit-testing and rendering.
 * Keep these in sync when changing GameCanvas or GameOverOverlay layout.
 */

/** Top actions bar Restart button (hit area) */
export const TOP_RESTART = {
  LEFT_OFFSET: 10,
  WIDTH: 100,
  TOP_OFFSET: 15,
  HEIGHT: 40
} as const

/** Game-over overlay modal */
export const GAME_OVER_OVERLAY = {
  BOX_WIDTH: 220,
  BOX_HEIGHT: 140,
  BUTTON_WIDTH: 140,
  BUTTON_HEIGHT: 44,
  /** Vertical offset of button from center */
  BUTTON_TOP_OFFSET: 20
} as const
