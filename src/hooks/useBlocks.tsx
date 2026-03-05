import { useImage } from '@shopify/react-native-skia'

import type { BlockMap } from '../model/types'

/** Block assets: color prefix -> [1x1, 1x2, 1x3, 1x4]. Metro requires static paths. */
/* eslint-disable @typescript-eslint/no-var-requires */
const BLOCK_ASSETS: Record<string, [unknown, unknown, unknown, unknown]> = {
  '#FF0000': [
    require('../assets/blocks/r1x1.png'),
    require('../assets/blocks/r1x2.png'),
    require('../assets/blocks/r1x3.png'),
    require('../assets/blocks/r1x4.png')
  ],
  '#00FF00': [
    require('../assets/blocks/g1x1.png'),
    require('../assets/blocks/g1x2.png'),
    require('../assets/blocks/g1x3.png'),
    require('../assets/blocks/g1x4.png')
  ],
  '#0000FF': [
    require('../assets/blocks/b1x1.png'),
    require('../assets/blocks/b1x2.png'),
    require('../assets/blocks/b1x3.png'),
    require('../assets/blocks/b1x4.png')
  ],
  '#FFFF00': [
    require('../assets/blocks/y1x1.png'),
    require('../assets/blocks/y1x2.png'),
    require('../assets/blocks/y1x3.png'),
    require('../assets/blocks/y1x4.png')
  ],
  '#FF00FF': [
    require('../assets/blocks/m1x1.png'),
    require('../assets/blocks/m1x2.png'),
    require('../assets/blocks/m1x3.png'),
    require('../assets/blocks/m1x4.png')
  ],
  '#00FFFF': [
    require('../assets/blocks/lb1x1.png'),
    require('../assets/blocks/lb1x2.png'),
    require('../assets/blocks/lb1x3.png'),
    require('../assets/blocks/lb1x4.png')
  ],
  '#000': [
    require('../assets/blocks/s1x1.png'),
    require('../assets/blocks/s1x2.png'),
    require('../assets/blocks/s1x3.png'),
    require('../assets/blocks/s1x4.png')
  ]
}

export const useBlocks = (): BlockMap => {
  const block: BlockMap = {} as BlockMap
  for (const color of Object.keys(BLOCK_ASSETS)) {
    const assets = BLOCK_ASSETS[color]
    block[color] = [
      useImage(assets[0] as number),
      useImage(assets[1] as number),
      useImage(assets[2] as number),
      useImage(assets[3] as number)
    ]
  }
  return block
}
