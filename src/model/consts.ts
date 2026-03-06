import { Dimensions } from 'react-native'

export const ROWS_COUNT = 10
export const COLUMNS_COUNT = 8
export const PADDING = 30

export const KEYS_SIZE = 48
export const KEYS = Array.from({ length: KEYS_SIZE }, (_, i) => String(i))

/** Pool size for concurrent explosion animations. Multi-cell blocks use one slot per cell (e.g. 4-cell = 4 slots). */
export const EXPLOSION_POOL_SIZE = 16

/**
 * Computed once at module load. Does not update on rotation or dimension change.
 * For responsive layouts, consider computing CELL_SIZE in a hook.
 */
export const CELL_SIZE = (() => {
  const { width } = Dimensions.get('window')
  const size = width - PADDING * 2
  const cellSize = size / COLUMNS_COUNT
  return cellSize
})()

/** Game board pixel dimensions (computed from CELL_SIZE) */
export const GAME_WIDTH = CELL_SIZE * COLUMNS_COUNT
export const GAME_HEIGHT = CELL_SIZE * ROWS_COUNT

/** Asset counts for loading progress: blocks (7 colors × 4 sizes) + bg */
export const TOTAL_ASSETS_IMAGE = 7 * 4 + 1
/** Asset count when using Skia drawing (bg only) */
export const TOTAL_ASSETS_SKIA = 1
