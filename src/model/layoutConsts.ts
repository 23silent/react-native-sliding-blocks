/**
 * Centralized layout constants for UI hit-testing and rendering.
 * Keep these in sync when changing GameCanvas or GameOverOverlay layout.
 */

/** Top actions bar Pause button (hit area and visual) */
export const TOP_PAUSE = {
  LEFT_OFFSET: 10,
  WIDTH: 80,
  TOP_OFFSET: 8,
  HEIGHT: 40
} as const

/** Score bar layout — zones to avoid overlap */
export const SCORE_BAR = {
  HEIGHT: 56,
  PADDING_H: 16,
  PAUSE_GAP: 12,
  STATS_GAP: 12,
  /** Gap between stats pills and right edge (no menu button anymore) */
  STATS_RIGHT_GAP: 16,
  PILL_PADDING: 10,
  PILL_MIN_WIDTH: 64
} as const

/** Pause overlay modal */
export const PAUSE_OVERLAY = {
  BOX_WIDTH: 200,
  BOX_HEIGHT: 220,
  BUTTON_WIDTH: 150,
  BUTTON_HEIGHT: 40,
  BUTTON_GAP: 12,
  /** Vertical offset of first button from box top */
  FIRST_BUTTON_TOP: 70
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

/** Loading overlay (preloader) */
export const LOADING_OVERLAY = {
  BOX_WIDTH: 260,
  BOX_HEIGHT: 80,
  BAR_HEIGHT: 10,
  BAR_RADIUS: 4,
  BAR_INSET: 16,
  /** Minimum time to show loading (ms) — avoids flash on fast loads */
  MIN_DISPLAY_MS: 600,
  /** Extra time (ms) to keep preloader visible after game view is ready */
  POST_LOAD_DELAY_MS: 700,
  /** Duration (ms) for progress bar fill animation */
  FILL_ANIMATION_DURATION_MS: 400
} as const

/** Game root layout */
export const GAME_ROOT = {
  ACTIONS_BAR_HEIGHT: 70,
  DIVIDER_HEIGHT: 12
} as const

/** Home screen menu buttons */
export const HOME_SCREEN = {
  BUTTON_WIDTH: 220,
  BUTTON_HEIGHT: 52,
  BUTTON_GAP: 16
} as const

/** Shared background for menu/splash screens */
export const MENU_BG = 'rgba(15,23,42,0.98)' as const

/** Default corner radius for Skia buttons */
export const SKIA_BUTTON_RADIUS = 10
