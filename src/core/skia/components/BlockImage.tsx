import { Image, type SkImage } from '@shopify/react-native-skia'
import React from 'react'
import type { SharedValue } from 'react-native-reanimated'
import { useDerivedValue } from 'react-native-reanimated'

import { CELL_SIZE } from '../../../model/consts'
import type { BlockMap } from '../../../model/types'

export type BlockImageSlot = {
  translateX: SharedValue<number>
  translateY: SharedValue<number>
  width: SharedValue<number>
  opacity: SharedValue<number>
  color: SharedValue<string>
}

type Props = {
  slot: BlockImageSlot
  block: BlockMap
  height?: number
}

/**
 * Renders a block image at slot position, derived from block map by color and size.
 * Used by both GameCanvasItem and GameCanvasGhost for consistent block rendering.
 */
export function BlockImage({
  slot,
  block,
  height = CELL_SIZE
}: Props): React.JSX.Element {
  const image = useDerivedValue<SkImage | null>(
    () => {
      const color = slot.color.value
      const size = Math.round(slot.width.value / CELL_SIZE)
      return (block?.[color]?.[size - 1] ?? null) as SkImage | null
    },
    [block]
  )

  return (
    <Image
      image={image}
      fit="contain"
      x={slot.translateX}
      y={slot.translateY}
      width={slot.width}
      height={height}
      opacity={slot.opacity}
    />
  )
}
