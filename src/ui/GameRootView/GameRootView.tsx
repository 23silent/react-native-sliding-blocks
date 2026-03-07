import React, { memo, useMemo } from 'react'

import type { IGameEngine } from '../../engine'
import type { GameLayoutSettings } from '../../types/settings'
import { mergeSettings } from '../defaults'
import { type BlockRenderMode,GameCanvas } from '../GameCanvas'
import { useGameRoot } from '../hooks/useGameRoot'
import {
  DEFAULT_SLIDING_BLOCKS_THEME,
  type SlidingBlocksAssets,
  type SlidingBlocksCallbacks
} from '../SlidingBlocks.types'
import { SlidingBlocksProvider } from '../SlidingBlocksContext'
import { mergeTheme, noop } from '../utils/theme'
import { GameRootInner } from './GameRootInner'

type GameRootViewProps = {
  config: GameLayoutSettings
  engine?: IGameEngine
  assets?: SlidingBlocksAssets
  callbacks?: SlidingBlocksCallbacks
  onMenuPress?: () => void
  blockRenderMode?: BlockRenderMode
  onLoadProgress?: (progress: number) => void
  onLoadComplete?: () => void
}

export const GameRootView = memo(function GameRootView({
  config: layoutConfig,
  engine: engineProp,
  assets,
  callbacks = {},
  onMenuPress,
  blockRenderMode = 'image',
  onLoadProgress,
  onLoadComplete
}: GameRootViewProps): React.JSX.Element {
  const showFinishOption = !!onMenuPress

  const gameRoot = useGameRoot({
    layoutConfig,
    engine: engineProp,
    assets,
    callbacks,
    showFinishOption,
    onMenuPress
  })

  const settings = useMemo(() => mergeSettings(), [])
  const theme = useMemo(
    () => mergeTheme(DEFAULT_SLIDING_BLOCKS_THEME),
    []
  )

  const contextValue = useMemo(
    () => ({
      config: gameRoot.config,
      settings,
      theme,
      callbacks: {
        onScoreChange: callbacks.onScoreChange ?? noop,
        onGameOver: callbacks.onGameOver ?? noop,
        onPause: callbacks.onPause ?? noop,
        onResume: callbacks.onResume ?? noop,
        onRestart: callbacks.onRestart ?? noop,
        onFinish: callbacks.onFinish ?? noop,
        onGestureStart: callbacks.onGestureStart ?? noop,
        onGestureEnd: callbacks.onGestureEnd ?? noop,
        onRemovingStart: callbacks.onRemovingStart ?? noop,
        onRemovingEnd: callbacks.onRemovingEnd ?? noop,
        onFitStart: callbacks.onFitStart ?? noop,
        onFitComplete: callbacks.onFitComplete ?? (() => {}),
        onRowAdded: callbacks.onRowAdded ?? noop
      },
      showFinishOption
    }),
    [gameRoot.config, settings, theme, callbacks, showFinishOption]
  )

  return (
    <SlidingBlocksProvider value={contextValue}>
      <GameRootInner
        engine={gameRoot.engine}
        shared={gameRoot.shared}
        layout={gameRoot.layout}
        onTapOrRestart={gameRoot.handleTapOrRestart}
      >
        <GameCanvas
          shared={gameRoot.shared}
          layout={gameRoot.layout}
          config={gameRoot.config}
          block={gameRoot.block}
          screenWidth={gameRoot.screenWidth}
          screenHeight={gameRoot.screenHeight}
          backgroundImage={assets?.backgroundImage}
          hasBlockImages={gameRoot.hasBlockImages}
          showFinishOption={showFinishOption}
          blockRenderMode={blockRenderMode}
          onLoadProgress={onLoadProgress}
          onLoadComplete={onLoadComplete}
        />
      </GameRootInner>
    </SlidingBlocksProvider>
  )
})
