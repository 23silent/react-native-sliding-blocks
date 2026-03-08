import type { EngineConfig } from './config'
import type { GameEngineHost } from './host'
import type { PathSegment } from './model/types'
import { GameEngine } from './viewmodels/GameEngine'

export type AnimOverrides = {
  removeFadeMs?: number
  itemDropMs?: number
}

export type CreateGameEngineOptions = {
  onRowAdded?: (row: PathSegment[]) => void
  /** Override animation durations used for step-complete timeouts. */
  animOverrides?: AnimOverrides
}

/**
 * Creates a game engine instance.
 * @param config - Engine configuration (rows, columns, keys, cellSize)
 * @param host - Optional host (unused; kept for compatibility)
 * @param options - Optional callbacks (e.g. onRowAdded) and animOverrides
 */
export function createGameEngine(
  config: EngineConfig,
  host?: GameEngineHost,
  options?: CreateGameEngineOptions
): GameEngine {
  return new GameEngine(config, host, options)
}
