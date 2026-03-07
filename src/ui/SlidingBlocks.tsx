import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo
} from 'react'

import { mergeSettings } from './defaults'
import {GameCanvas } from './GameCanvas'
import { GameRootInner } from './GameRootView/GameRootInner'
import { useGameRoot } from './hooks/useGameRoot'
import {
  DEFAULT_SLIDING_BLOCKS_THEME,
  type SlidingBlocksHandle,
  type SlidingBlocksProps
} from './SlidingBlocks.types'
import { SlidingBlocksProvider } from './SlidingBlocksContext'
import { mergeTheme, noop } from './utils/theme'

const SlidingBlocksInner = memo(
  forwardRef<SlidingBlocksHandle, SlidingBlocksProps>(function SlidingBlocksInner(
    {
      config: layoutConfig,
      engine,
      assets,
      theme: themeOverrides,
      callbacks = {},
      settings: settingsOverrides,
      blockRenderMode = 'skia',
      showFinishOption = false,
      onLoadProgress,
      onLoadComplete
    },
    ref
  ): React.JSX.Element {
    const gameRoot = useGameRoot({
      layoutConfig,
      engine,
      assets,
      callbacks,
      showFinishOption
    })

    const settings = useMemo(
      () => mergeSettings(settingsOverrides),
      [settingsOverrides]
    )

    const theme = useMemo(
      () => mergeTheme(DEFAULT_SLIDING_BLOCKS_THEME, themeOverrides),
      [themeOverrides]
    )

    useImperativeHandle(
      ref,
      () => gameRoot.getImperativeHandle() as SlidingBlocksHandle,
      [gameRoot.getImperativeHandle]
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
      [
        gameRoot.config,
        settings,
        theme,
        callbacks,
        showFinishOption
      ]
    )

    return (
      <SlidingBlocksProvider value={contextValue}>
        <GameRootInner
          engine={gameRoot.engine}
          shared={gameRoot.shared}
          layout={gameRoot.layout}
          onTapOrRestart={gameRoot.handleTapOrRestart}
          onGestureStart={callbacks.onGestureStart}
          onGestureEnd={callbacks.onGestureEnd}
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
)

export const SlidingBlocks = forwardRef<SlidingBlocksHandle, SlidingBlocksProps>(
  (props, ref) => <SlidingBlocksInner {...props} ref={ref} />
)
SlidingBlocks.displayName = 'SlidingBlocks'
