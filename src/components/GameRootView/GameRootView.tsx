import React, { memo, useCallback, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  CELL_SIZE,
  COLUMNS_COUNT,
  PADDING,
  ROWS_COUNT
} from '../../model/consts'
import { TOP_RESTART } from '../../model/layoutConsts'
import type { PathSegment } from '../../model/types'
import { GameEngine, useEngineBridge, useSharedValuesMap } from '../../engine'
import { useBlocks } from '../../hooks/useBlocks'
import { GameCanvas } from '../GameCanvas'
import { GameGestureViewEngine } from '../GameGestureView/GameGestureViewEngine'
import { hitTestRestart as hitTestGameOverRestart } from '../../utils/gameOverHitTest'

const ACTIONS_BAR_HEIGHT = 70
const DIVIDER_HEIGHT = 12
const GAME_WIDTH = CELL_SIZE * COLUMNS_COUNT
const GAME_HEIGHT = CELL_SIZE * ROWS_COUNT

const getTopRestartBounds = (layout: {
  contentTop: number
  actionsBarLeft: number
}) => ({
  left: layout.actionsBarLeft + TOP_RESTART.LEFT_OFFSET,
  right: layout.actionsBarLeft + TOP_RESTART.LEFT_OFFSET + TOP_RESTART.WIDTH,
  top: layout.contentTop + TOP_RESTART.TOP_OFFSET,
  bottom: layout.contentTop + TOP_RESTART.TOP_OFFSET + TOP_RESTART.HEIGHT
})

const hitTestTopRestart = (
  x: number,
  y: number,
  layout: { contentTop: number; actionsBarLeft: number }
): boolean => {
  const b = getTopRestartBounds(layout)
  return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom
}

export const GameRootView = memo((): React.JSX.Element => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const [engine] = useState(() => new GameEngine())
  const shared = useSharedValuesMap()
  const block = useBlocks()

  const layout = useMemo(() => {
    const contentHeight = ACTIONS_BAR_HEIGHT + DIVIDER_HEIGHT + GAME_HEIGHT
    const contentTop = Math.max(
      insets.top,
      (screenHeight - insets.top - insets.bottom - contentHeight) / 2 +
        insets.top
    )
    const gameAreaY = contentTop + ACTIONS_BAR_HEIGHT + DIVIDER_HEIGHT
    const gameAreaX = (screenWidth - GAME_WIDTH) / 2
    return {
      contentTop,
      gameAreaX,
      gameAreaY,
      actionsBarLeft: PADDING,
      actionsBarWidth: screenWidth - PADDING * 2
    }
  }, [screenWidth, screenHeight, insets])

  const onCompleteEnd = useCallback(
    (updated?: PathSegment[][]) => {
      engine.setActiveItem(undefined)
      engine.onAnimationFinish()
      if (updated) engine.onCompleteGesture(updated)
    },
    [engine]
  )

  useEngineBridge(engine, shared, { onCompleteEnd })

  const handleTapOrRestart = useCallback(
    (x: number, y: number): boolean => {
      if (hitTestTopRestart(x, y, layout)) {
        engine.restart()
        return true
      }
      const gameOver = engine.getGameOver()
      if (
        gameOver &&
        hitTestGameOverRestart(x - layout.gameAreaX, y - layout.gameAreaY)
      ) {
        engine.restart()
        return true
      }
      return false
    },
    [engine, layout]
  )

  return (
    <GameGestureViewEngine
      engine={engine}
      layout={layout}
      onTapOrRestart={handleTapOrRestart}
    >
      <GameCanvas
        shared={shared}
        layout={layout}
        block={block}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />
    </GameGestureViewEngine>
  )
})
