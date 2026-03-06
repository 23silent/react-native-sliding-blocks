import { GAME_HEIGHT, GAME_WIDTH } from '../model/consts'
import { GAME_OVER_OVERLAY } from '../model/layoutConsts'

const { BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_TOP_OFFSET } = GAME_OVER_OVERLAY

export const GAME_OVER_RESTART_BOUNDS = {
  left: GAME_WIDTH / 2 - BUTTON_WIDTH / 2,
  right: GAME_WIDTH / 2 + BUTTON_WIDTH / 2,
  top: GAME_HEIGHT / 2 + BUTTON_TOP_OFFSET,
  bottom: GAME_HEIGHT / 2 + BUTTON_TOP_OFFSET + BUTTON_HEIGHT
}

export const hitTestRestart = (x: number, y: number): boolean => {
  const { left, right, top, bottom } = GAME_OVER_RESTART_BOUNDS
  return x >= left && x <= right && y >= top && y <= bottom
}
