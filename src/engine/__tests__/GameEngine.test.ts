/**
 * GameEngine unit tests.
 * Run with: npx jest slidingBlocks/sdk/__tests__/GameEngine.test.ts
 *
 * Note: Requires jest.mock('react-native-sound-player') in setup.
 */
import { firstValueFrom } from 'rxjs'

import { computeGameConfig, toEngineConfig } from '../../config'
import type { GameLayoutSettings } from '../../types/settings'
import { createGameEngine } from '..'

jest.mock('react-native-sound-player', () => ({
  loadSoundFile: jest.fn(),
  playSoundFile: jest.fn()
}))

const testGameLayout: GameLayoutSettings = {
  rowsCount: 10,
  columnsCount: 8,
  padding: 16,
  keysSize: 48,
  explosionPoolSize: 12
}

const testConfig = toEngineConfig(
  computeGameConfig(testGameLayout, 400)
)

describe('GameEngine', () => {
  let engine: ReturnType<typeof createGameEngine>

  beforeEach(() => {
    engine = createGameEngine(testConfig)
  })

  it('exposes observable streams', () => {
    expect(engine.items$).toBeDefined()
    expect(engine.activeItem$).toBeDefined()
    expect(engine.score$).toBeDefined()
    expect(engine.multiplier$).toBeDefined()
    expect(engine.gameOver$).toBeDefined()
    expect(engine.onChangeTranslateX$).toBeDefined()
    expect(engine.onCompleteEnd$).toBeDefined()
  })

  it('getGameOver returns null initially', () => {
    expect(engine.getGameOver()).toBeNull()
  })

  it('getRows returns array', () => {
    const rows = engine.getRows()
    expect(Array.isArray(rows)).toBe(true)
  })

  it('restart resets gameOver', async () => {
    engine.restart()
    expect(engine.getGameOver()).toBeNull()
  })

  it('score$ emits initial value', async () => {
    const score = await firstValueFrom(engine.score$)
    expect(typeof score).toBe('number')
  })

  it('getGameState returns serializable snapshot with layoutVersion', () => {
    const state = engine.getGameState()
    expect(state).toMatchObject({
      score: expect.any(Number),
      multiplier: expect.any(Number),
      layoutVersion: {
        rowsCount: 10,
        columnsCount: 8,
        keysSize: 48
      }
    })
    expect(Array.isArray(state.rows)).toBe(true)
    expect(state.gameOver).toBe(false)
  })

  it('createGameEngine with initialState restores state', () => {
    const snapshot = engine.getGameState()
    const restored = createGameEngine(testConfig, undefined, {
      initialState: snapshot
    })
    const restoredState = restored.getGameState()
    expect(restoredState.score).toBe(snapshot.score)
    expect(restoredState.multiplier).toBe(snapshot.multiplier)
    expect(restoredState.rows).toEqual(snapshot.rows)
  })
})
