/**
 * Shared inner game root - gesture view + children.
 * Used by SlidingBlocks, GameRootView, and useSlidingBlocks.
 */

import React, { memo, PropsWithChildren } from 'react'

import type { SharedValuesMap } from '../../bridge'
import type { IGameEngine } from '../../engine'
import type { GameLayout } from '../../types/layout'
import { GameGestureViewEngine } from '../GameGestureView/GameGestureViewEngine'

export type GameRootInnerProps = PropsWithChildren<{
  engine: IGameEngine
  shared: SharedValuesMap
  layout: GameLayout
  onTapOrRestart: (x: number, y: number) => boolean
  onGestureStart?: () => void
  onGestureEnd?: () => void
}>

export const GameRootInner = memo(function GameRootInner({
  children,
  engine,
  shared,
  layout,
  onTapOrRestart,
  onGestureStart,
  onGestureEnd
}: GameRootInnerProps): React.JSX.Element {
  return (
    <GameGestureViewEngine
      engine={engine}
      shared={shared}
      layout={layout}
      onTapOrRestart={onTapOrRestart}
      onGestureStart={onGestureStart}
      onGestureEnd={onGestureEnd}
    >
      {children}
    </GameGestureViewEngine>
  )
})
