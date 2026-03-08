import type { PathSegment } from './model/types'

/**
 * Serializable game state snapshot for persistence.
 * Host can persist this (e.g. AsyncStorage) and pass it back as initialState to resume.
 */
export type GameStateSnapshot = {
  /** Board rows - core game state */
  rows: PathSegment[][]
  /** Current score */
  score: number
  /** Current multiplier (1-5) */
  multiplier: number
  /** Layout identifiers - host should only resume if these match current config */
  layoutVersion: {
    rowsCount: number
    columnsCount: number
    keysSize: number
  }
  /** True when game is over - host typically clears saved state */
  gameOver?: boolean
}

/** Returns layout version from engine config for snapshot validation */
export function getLayoutVersion(config: {
  rowsCount: number
  columnsCount: number
  keysSize: number
}): GameStateSnapshot['layoutVersion'] {
  return {
    rowsCount: config.rowsCount,
    columnsCount: config.columnsCount,
    keysSize: config.keysSize
  }
}

/** Returns true if snapshot is compatible with current layout config */
export function isSnapshotCompatible(
  snapshot: GameStateSnapshot,
  config: { rowsCount: number; columnsCount: number; keysSize: number }
): boolean {
  const v = snapshot.layoutVersion
  return (
    v.rowsCount === config.rowsCount &&
    v.columnsCount === config.columnsCount &&
    v.keysSize === config.keysSize
  )
}
