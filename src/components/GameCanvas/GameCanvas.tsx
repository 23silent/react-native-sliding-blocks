import { Canvas, Fill, Group, Image, useImage } from '@shopify/react-native-skia'

import { CheckerboardGrid, Panel, SkiaLabel } from '../../core/skia'
import React, { memo } from 'react'
import { useDerivedValue } from 'react-native-reanimated'

import {
  CELL_SIZE,
  COLUMNS_COUNT,
  KEYS,
  ROWS_COUNT
} from '../../model/consts'
import { fonts } from '../../utils/fonts'
import type { SharedValuesMap } from '../../engine/useSharedValuesMap'
import { GameCanvasGhost } from './GameCanvasGhost'
import { GameCanvasIndicator } from './GameCanvasIndicator'
import { GameCanvasItem } from './GameCanvasItem'
import { GameOverOverlay } from './GameOverOverlay'
import type { BlockMap } from '../../model/types'

const GAME_WIDTH = CELL_SIZE * COLUMNS_COUNT
const GAME_HEIGHT = CELL_SIZE * ROWS_COUNT

export type GameLayout = {
  contentTop: number
  gameAreaX: number
  gameAreaY: number
  actionsBarLeft: number
  actionsBarWidth: number
}

type GameCanvasProps = {
  shared: SharedValuesMap
  layout: GameLayout
  block: BlockMap
  screenWidth: number
  screenHeight: number
}

export const GameCanvas = memo(function GameCanvas({
  shared,
  layout,
  block,
  screenWidth,
  screenHeight
}: GameCanvasProps): React.JSX.Element {
  const bgImage = useImage(require('../../assets/bg.jpg'))

  const scoreText = useDerivedValue(() => `${Math.round(shared.score.value)}`)
  const multiplierText = useDerivedValue(
    () => `${Math.round(shared.multiplier.value)}`
  )

  return (
    <Canvas style={{ flex: 1 }}>
      {bgImage ? (
        <Image
          image={bgImage}
          x={0}
          y={0}
          width={screenWidth}
          height={screenHeight}
          fit="cover"
        />
      ) : (
        <Fill color="rgba(200,200,200,0.5)" />
      )}
      <Fill color="rgba(255,255,255,0.3)" />
      <Group transform={[{ translateY: layout.contentTop }]}>
        <Panel
          x={layout.actionsBarLeft}
          y={0}
          width={layout.actionsBarWidth}
          height={50}
          r={10}
          color="rgba(0,0,0,0.4)"
        />
        <SkiaLabel
          x={layout.actionsBarLeft + 20}
          y={38}
          text="Restart"
          font={fonts.button}
          color="white"
        />
        <SkiaLabel
          x={layout.actionsBarLeft + layout.actionsBarWidth / 2 - 80}
          y={18}
          text="Score"
          font={fonts.label}
          color="white"
        />
        <SkiaLabel
          x={layout.actionsBarLeft + layout.actionsBarWidth / 2 - 60}
          y={42}
          text={scoreText}
          font={fonts.score}
          color="white"
        />
        <SkiaLabel
          x={layout.actionsBarLeft + layout.actionsBarWidth / 2 + 10}
          y={18}
          text="Multiplier"
          font={fonts.label}
          color="white"
        />
        <SkiaLabel
          x={layout.actionsBarLeft + layout.actionsBarWidth / 2 + 30}
          y={42}
          text={multiplierText}
          font={fonts.score}
          color="white"
        />
      </Group>
      <Group
        transform={[
          { translateX: layout.gameAreaX },
          { translateY: layout.gameAreaY }
        ]}
      >
        <Panel
          x={0}
          y={0}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          r={10}
          color="transparent"
        />
        <CheckerboardGrid
          rows={ROWS_COUNT}
          cols={COLUMNS_COUNT}
          cellSize={CELL_SIZE}
        />
        {/* Indicator */}
        <GameCanvasIndicator
          indicator={shared.indicator}
          translateX={shared.translateX}
        />
        {/* Ghost */}
        <GameCanvasGhost ghost={shared.ghost} block={block} />
        {KEYS.map(key => (
          <GameCanvasItem
            key={key}
            slot={shared.items[key]}
            translateX={shared.translateX}
            block={block}
          />
        ))}
        {/* Game Over Overlay */}
        <GameOverOverlay
          overlay={shared.overlay}
          gameWidth={GAME_WIDTH}
          gameHeight={GAME_HEIGHT}
        />
      </Group>
    </Canvas>
  )
})
