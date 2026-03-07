/**
 * Computes score bar layout: pause button position, pill positions, dimensions.
 * Keeps GameCanvas and ScoreBarCanvas layout logic in one place.
 */

import { useMemo } from 'react'

import { SCORE_BAR, TOP_PAUSE } from '../../constants/layout'
import type { GameLayout } from '../../types/layout'

const {
  HEIGHT: barHeight,
  PADDING_H: barPadding,
  PAUSE_GAP,
  STATS_GAP,
  STATS_RIGHT_GAP,
  PILL_PADDING,
  PILL_MIN_WIDTH
} = SCORE_BAR

export type ScoreBarLayout = {
  barHeight: number
  pauseLeft: number
  pauseTop: number
  scoreLeft: number
  multiplierLeft: number
  pillWidth: number
  pillTop: number
  pillHeight: number
  pillRadius: number
  labelY: number
  valueY: number
  textLeft: number
}

export function useScoreBarLayout(layout: GameLayout): ScoreBarLayout {
  return useMemo(() => {
    const pauseLeft = layout.actionsBarLeft + TOP_PAUSE.LEFT_OFFSET
    const pauseTop = TOP_PAUSE.TOP_OFFSET
    const statsZoneLeft = pauseLeft + TOP_PAUSE.WIDTH + PAUSE_GAP
    const statsZoneRight =
      layout.actionsBarLeft + layout.actionsBarWidth - barPadding - STATS_RIGHT_GAP
    const statsZoneWidth = Math.max(0, statsZoneRight - statsZoneLeft)
    const pillWidth = Math.min(
      PILL_MIN_WIDTH,
      Math.max(0, (statsZoneWidth - STATS_GAP) / 2)
    )
    const scoreLeft = statsZoneLeft
    const multiplierLeft = scoreLeft + pillWidth + STATS_GAP
    const pillTop = (barHeight - 32) / 2
    const pillHeight = 32
    const pillRadius = 10
    const labelY = pillTop + 10
    const valueY = pillTop + 26

    return {
      barHeight,
      pauseLeft,
      pauseTop,
      scoreLeft,
      multiplierLeft,
      pillWidth,
      pillTop,
      pillHeight,
      pillRadius,
      labelY,
      valueY,
      textLeft: PILL_PADDING
    }
  }, [
    layout.actionsBarLeft,
    layout.actionsBarWidth
  ])
}
