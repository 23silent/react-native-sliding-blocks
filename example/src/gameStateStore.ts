/**
 * Host game state persistence via AsyncStorage.
 * Saves/loads GameStateSnapshot so the game can resume after app kill.
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import type { GameStateSnapshot } from 'react-native-sliding-blocks'

const STORAGE_KEY = '@sliding_blocks_game_state'

export async function loadGameState(): Promise<GameStateSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameStateSnapshot
    if (
      !parsed.rows ||
      !Array.isArray(parsed.rows) ||
      typeof parsed.score !== 'number' ||
      typeof parsed.multiplier !== 'number' ||
      !parsed.layoutVersion
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export async function saveGameState(state: GameStateSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore save errors
  }
}

export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}
