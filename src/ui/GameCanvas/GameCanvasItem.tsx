import React from 'react'
import type { SharedValue } from 'react-native-reanimated'

import type { ItemSlotSharedValues } from '../../bridge'
import type { BlockMap } from '../../engine'
import type { BlockSettings } from '../../types/settings'
import { activeGestureSync, BlockImage, useReactionRule } from '../skia'
import type { BlockTheme } from '../SlidingBlocks.types'

type Props = {
  slot: ItemSlotSharedValues
  translateX: SharedValue<number>
  block: BlockMap
  cellSize: number
  useSkiaDrawing?: boolean
  blockSettings: BlockSettings
  blockTheme: BlockTheme
}

export function GameCanvasItem({
  slot,
  translateX,
  block,
  cellSize,
  useSkiaDrawing = false,
  blockSettings,
  blockTheme
}: Props): React.JSX.Element {
  useReactionRule(activeGestureSync(slot, translateX))

  return (
    <BlockImage
      slot={slot}
      block={block}
      cellSize={cellSize}
      useSkiaDrawing={useSkiaDrawing}
      blockSettings={blockSettings}
      blockTheme={blockTheme}
    />
  )
}
