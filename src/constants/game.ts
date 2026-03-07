/**
 * Game-related constants.
 */

/** Block images only: 7 colors × 4 sizes (for GameAreaCanvas, which has no bg) */
export const TOTAL_BLOCK_ASSETS = 7 * 4

/** Asset counts for loading progress: blocks + bg */
export const TOTAL_ASSETS_IMAGE = TOTAL_BLOCK_ASSETS + 1

/** Asset count when using Skia drawing (bg only) */
export const TOTAL_ASSETS_SKIA = 1

/** Pan gesture multiplier for translateX (higher = more sensitive) */
export const GESTURE_SENSITIVITY = 1.25
