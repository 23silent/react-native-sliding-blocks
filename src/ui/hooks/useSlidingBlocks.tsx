import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { ComposableSlidingBlocksProvider } from '../ComposableSlidingBlocksContext'
import { mergeSettings } from '../defaults'
import type { BlockRenderMode } from '../GameCanvas'
import { GameAreaCanvas } from '../GameCanvas/GameAreaCanvas'
import { ScoreBarCanvas } from '../GameCanvas/ScoreBarCanvas'
import { GameRootInner } from '../GameRootView/GameRootInner'
import {
  DEFAULT_SLIDING_BLOCKS_THEME,
  type SlidingBlocksHandle,
  type SlidingBlocksProps
} from '../SlidingBlocks.types'
import { SlidingBlocksProvider } from '../SlidingBlocksContext'
import { mergeTheme, noop } from '../utils/theme'
import { useGameRoot } from './useGameRoot'

/** Props for the GameArea component returned by useSlidingBlocks. */
export type GameAreaProps = {
  blockRenderMode?: BlockRenderMode
  showFinishOption?: boolean
  onLoadProgress?: (progress: number) => void
  onLoadComplete?: () => void
}

export type UseSlidingBlocksReturn = {
  /** Wrapper - provides context and gesture handling. Must wrap ScoreBar and GameArea. */
  Root: React.FC<{ children: React.ReactNode }>
  /** Default score bar - Skia Canvas. Render inside Root. */
  ScoreBar: React.FC
  /** Game area - Skia Canvas (blocks, grid, overlays). Render inside Root. */
  GameArea: React.FC<GameAreaProps>
  /** Imperative handle - pause, resume, restart, isPaused. */
  ref: React.RefObject<SlidingBlocksHandle | null>
  /**
   * Layout and shared values are available inside Root via useComposableSlidingBlocksContext().
   * Use that hook when building custom layouts or score bars.
   */
}

/**
 * Internal provider - runs hook logic. Uses useGameRoot for shared logic.
 */
function SlidingBlocksDataProvider({
  props: hookProps,
  children,
  imperativeRef
}: {
  props: SlidingBlocksProps
  children: React.ReactNode
  imperativeRef: React.MutableRefObject<SlidingBlocksHandle | null>
}) {
  const {
    config: layoutConfig,
    engine: engineProp,
    assets,
    theme: themeOverrides,
    callbacks = {},
    settings: settingsOverrides,
    blockRenderMode: _blockRenderMode = 'skia',
    showFinishOption = false,
    onLoadProgress: _onLoadProgress,
    onLoadComplete: _onLoadComplete
  } = hookProps

  const settings = useMemo(
    () => mergeSettings(settingsOverrides),
    [settingsOverrides]
  )
  const gameRoot = useGameRoot({
    layoutConfig,
    engine: engineProp,
    assets,
    callbacks,
    showFinishOption,
    settings
  })

  const theme = useMemo(
    () => mergeTheme(DEFAULT_SLIDING_BLOCKS_THEME, themeOverrides),
    [themeOverrides]
  )

  useEffect(() => {
    imperativeRef.current = gameRoot.getImperativeHandle() as SlidingBlocksHandle
    return () => {
      imperativeRef.current = null
    }
  }, [gameRoot.getImperativeHandle, imperativeRef])

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
        onRowAdded: callbacks.onRowAdded ?? (() => {})
      },
      showFinishOption
    }),
    [gameRoot.config, settings, theme, callbacks, showFinishOption]
  )

  const composableContextValue = useMemo(
    () => ({
      shared: gameRoot.shared,
      layout: gameRoot.layout,
      config: gameRoot.config,
      block: gameRoot.block,
      hasBlockImages: gameRoot.hasBlockImages,
      screenWidth: gameRoot.screenWidth,
      screenHeight: gameRoot.screenHeight
    }),
    [
      gameRoot.shared,
      gameRoot.layout,
      gameRoot.config,
      gameRoot.block,
      gameRoot.hasBlockImages,
      gameRoot.screenWidth,
      gameRoot.screenHeight
    ]
  )

  return (
    <SlidingBlocksProvider value={contextValue}>
      <ComposableSlidingBlocksProvider value={composableContextValue}>
        <GameRootInner
          engine={gameRoot.engine}
          shared={gameRoot.shared}
          layout={gameRoot.layout}
          onTapOrRestart={gameRoot.handleTapOrRestart}
          onGestureStart={hookProps.callbacks?.onGestureStart}
          onGestureEnd={hookProps.callbacks?.onGestureEnd}
        >
          {children}
        </GameRootInner>
      </ComposableSlidingBlocksProvider>
    </SlidingBlocksProvider>
  )
}

/** Stable Root component - does not remount when parent re-renders. */
function SlidingBlocksComposableRoot({
  props,
  children,
  imperativeRef
}: {
  props: SlidingBlocksProps
  children: React.ReactNode
  imperativeRef: React.MutableRefObject<SlidingBlocksHandle | null>
}) {
  return (
    <SlidingBlocksDataProvider props={props} imperativeRef={imperativeRef}>
      {children}
    </SlidingBlocksDataProvider>
  )
}

/**
 * Non-declarative API for SlidingBlocks. Returns composable pieces: Root, ScoreBar, GameArea, ref.
 * Use when you need custom layout or a custom score bar.
 *
 * Layout dimensions and shared values are only available inside Root.
 * Call useComposableSlidingBlocksContext() within Root's children to get layout, shared, config, block.
 */
export function useSlidingBlocks(
  props: SlidingBlocksProps
): UseSlidingBlocksReturn {
  const ref = useRef<SlidingBlocksHandle | null>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  const Root = useCallback(
    (rootProps: { children: React.ReactNode }) => (
      <SlidingBlocksComposableRoot
        props={propsRef.current}
        imperativeRef={ref}
      >
        {rootProps.children}
      </SlidingBlocksComposableRoot>
    ),
    []
  )

  const ScoreBar = useMemo(
    () =>
      function SlidingBlocksScoreBar(): React.JSX.Element {
        return <ScoreBarCanvas />
      },
    []
  )

  const defaultGameAreaPropsRef = useRef({
    blockRenderMode: props.blockRenderMode ?? 'skia',
    showFinishOption: props.showFinishOption ?? false,
    onLoadProgress: props.onLoadProgress,
    onLoadComplete: props.onLoadComplete
  })
  defaultGameAreaPropsRef.current = {
    blockRenderMode: props.blockRenderMode ?? 'skia',
    showFinishOption: props.showFinishOption ?? false,
    onLoadProgress: props.onLoadProgress,
    onLoadComplete: props.onLoadComplete
  }

  const GameArea = useMemo(
    () =>
      function SlidingBlocksGameArea(
        gameAreaProps?: GameAreaProps
      ): React.JSX.Element {
        const d = defaultGameAreaPropsRef.current
        return (
          <GameAreaCanvas
            blockRenderMode={gameAreaProps?.blockRenderMode ?? d.blockRenderMode}
            showFinishOption={
              gameAreaProps?.showFinishOption ?? d.showFinishOption
            }
            onLoadProgress={gameAreaProps?.onLoadProgress ?? d.onLoadProgress}
            onLoadComplete={gameAreaProps?.onLoadComplete ?? d.onLoadComplete}
          />
        )
      },
    []
  )

  return { Root, ScoreBar, GameArea, ref }
}
