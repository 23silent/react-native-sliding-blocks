/**
 * Score bar component - pause button, score pill, multiplier pill.
 * Used by GameCanvas (embedded) and ScoreBarCanvas (standalone).
 */

import { LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia'
import React, { memo } from 'react'
import { useDerivedValue } from 'react-native-reanimated'

import type { SharedValuesMap } from '../../bridge'
import { SKIA_BUTTON_RADIUS, TOP_PAUSE } from '../../constants/layout'
import type { GameLayout } from '../../types/layout'
import { SkiaButton, SkiaLabel } from '../skia'
import type { SlidingBlocksTheme } from '../SlidingBlocks.types'
import { fonts } from '../utils/fonts'
import {useScoreBarLayout } from './useScoreBarLayout'

type GameCanvasScoreBarProps = {
  layout: GameLayout
  shared: SharedValuesMap
  theme: SlidingBlocksTheme
  /** When true, bar is inside a Group with translateY - use yOffset 0. When false (standalone), add contentTop to y positions. */
  embedded?: boolean
}

export const GameCanvasScoreBar = memo(function GameCanvasScoreBar({
  layout,
  shared,
  theme,
  embedded = true
}: GameCanvasScoreBarProps): React.JSX.Element {
  const barLayout = useScoreBarLayout(layout)
  const scoreText = useDerivedValue(() => `${Math.round(shared.score.value)}`)
  const multiplierText = useDerivedValue(
    () => `${Math.round(shared.multiplier.value)}`
  )

  const yOffset = embedded ? 0 : layout.contentTop
  const barX = layout.actionsBarLeft
  const barY = embedded ? 0 : layout.contentTop

  return (
    <>
      <RoundedRect
        x={barX}
        y={barY}
        width={layout.actionsBarWidth}
        height={barLayout.barHeight}
        r={14}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(layout.actionsBarWidth, barLayout.barHeight)}
          colors={theme.scoreBar.gradientColors}
        />
      </RoundedRect>
      <SkiaButton
        x={barLayout.pauseLeft}
        y={yOffset + barLayout.pauseTop}
        width={TOP_PAUSE.WIDTH}
        height={TOP_PAUSE.HEIGHT}
        r={SKIA_BUTTON_RADIUS}
        color={theme.scoreBar.accentColor}
        label="Pause"
        labelX={barLayout.pauseLeft + (TOP_PAUSE.WIDTH - 44) / 2}
        labelY={yOffset + barLayout.pauseTop + TOP_PAUSE.HEIGHT / 2 + 7}
        font={fonts.buttonSmall}
        textColor="white"
      />
      <RoundedRect
        x={barLayout.scoreLeft}
        y={yOffset + barLayout.pillTop}
        width={barLayout.pillWidth}
        height={barLayout.pillHeight}
        r={barLayout.pillRadius}
        color={theme.scoreBar.pillColor}
      />
      <SkiaLabel
        x={barLayout.scoreLeft + barLayout.textLeft}
        y={yOffset + barLayout.labelY}
        text="Score"
        font={fonts.label}
        color={theme.scoreBar.labelColor}
      />
      <SkiaLabel
        x={barLayout.scoreLeft + barLayout.textLeft}
        y={yOffset + barLayout.valueY}
        text={scoreText}
        font={fonts.score}
        color={theme.scoreBar.valueColor}
      />
      <RoundedRect
        x={barLayout.multiplierLeft}
        y={yOffset + barLayout.pillTop}
        width={barLayout.pillWidth}
        height={barLayout.pillHeight}
        r={barLayout.pillRadius}
        color={theme.scoreBar.multiplierPillColor}
      />
      <SkiaLabel
        x={barLayout.multiplierLeft + barLayout.textLeft}
        y={yOffset + barLayout.labelY}
        text="Multiplier"
        font={fonts.label}
        color={theme.scoreBar.labelColor}
      />
      <SkiaLabel
        x={barLayout.multiplierLeft + barLayout.textLeft}
        y={yOffset + barLayout.valueY}
        text={multiplierText}
        font={fonts.score}
        color={theme.scoreBar.valueColor}
      />
    </>
  )
})
