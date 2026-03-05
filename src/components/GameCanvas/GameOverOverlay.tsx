import { Panel, SkiaButton, SkiaLabel, SkiaOverlay } from '../../core/skia'
import React from 'react'
import { useDerivedValue } from 'react-native-reanimated'

import { fonts } from '../../utils/fonts'
import type { SharedValuesMap } from '../../engine/useSharedValuesMap'

const BOX_WIDTH = 220
const BOX_HEIGHT = 140
const BUTTON_WIDTH = 140
const BUTTON_HEIGHT = 44

type Props = {
  overlay: SharedValuesMap['overlay']
  gameWidth: number
  gameHeight: number
}

export function GameOverOverlay({
  overlay,
  gameWidth,
  gameHeight
}: Props): React.JSX.Element {
  const boxLeft = (gameWidth - BOX_WIDTH) / 2
  const boxTop = (gameHeight - BOX_HEIGHT) / 2
  const buttonLeft = (gameWidth - BUTTON_WIDTH) / 2
  const buttonTop = gameHeight / 2 + 20

  const scoreText = useDerivedValue(
    () => `Score: ${Math.round(overlay.gameOverScore.value)}`
  )
  const backdropColor = useDerivedValue(
    () => `rgba(0,0,0,${overlay.opacity.value * 0.75})`
  )
  const boxColor = useDerivedValue(
    () => `rgba(30,30,40,${overlay.opacity.value * 0.95})`
  )
  const buttonColor = useDerivedValue(
    () => `rgba(59,130,246,${overlay.opacity.value * 0.9})`
  )

  return (
    <SkiaOverlay opacity={overlay.opacity}>
      <Panel
        x={0}
        y={0}
        width={gameWidth}
        height={gameHeight}
        r={0}
        color={backdropColor}
      />
      <Panel
        x={boxLeft}
        y={boxTop}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        r={12}
        color={boxColor}
      />
      <SkiaLabel
        x={boxLeft + (BOX_WIDTH - 120) / 2}
        y={boxTop + 50}
        text="Game Over"
        font={fonts.title}
        color="white"
      />
      <SkiaLabel
        x={boxLeft + (BOX_WIDTH - 80) / 2}
        y={boxTop + 80}
        text={scoreText}
        font={fonts.scoreLarge}
        color="white"
      />
      <SkiaButton
        x={buttonLeft}
        y={buttonTop}
        width={BUTTON_WIDTH}
        height={BUTTON_HEIGHT}
        r={10}
        color={buttonColor}
        label="Restart"
        labelX={buttonLeft + (BUTTON_WIDTH - 50) / 2}
        labelY={buttonTop + BUTTON_HEIGHT / 2 + 8}
        font={fonts.button}
        textColor="white"
      />
    </SkiaOverlay>
  )
}
