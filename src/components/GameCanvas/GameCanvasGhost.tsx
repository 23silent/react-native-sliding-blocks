import React from 'react'

import { BlockImage } from '../../core/skia'
import type { BlockMap } from '../../model/types'
import type { SharedValuesMap } from '../../engine/useSharedValuesMap'

type Props = {
  ghost: SharedValuesMap['ghost']
  block: BlockMap
}

export function GameCanvasGhost({ ghost, block }: Props): React.JSX.Element {
  return <BlockImage slot={ghost} block={block} />
}
