import { Canvas } from '@shopify/react-native-skia'
import React, { memo } from 'react'

import { useComposableSlidingBlocksContext } from '../ComposableSlidingBlocksContext'
import { useSlidingBlocksContext } from '../SlidingBlocksContext'
import { GameCanvasScoreBar } from './GameCanvasScoreBar'
import { useScoreBarLayout } from './useScoreBarLayout'

/**
 * Standalone score bar - Skia Canvas. Use with useSlidingBlocks composable API.
 * Renders pause button, score pill, multiplier pill.
 */
export const ScoreBarCanvas = memo(function ScoreBarCanvas(): React.JSX.Element {
  const { theme } = useSlidingBlocksContext()
  const { shared, layout } = useComposableSlidingBlocksContext()
  const barLayout = useScoreBarLayout(layout)
  const canvasHeight = layout.contentTop + barLayout.barHeight

  return (
    <Canvas
      style={
        /* eslint-disable-next-line react-native/no-inline-styles -- Skia Canvas; height is dynamic */
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: canvasHeight,
          zIndex: 10
        }
      }
    >
      <GameCanvasScoreBar
        layout={layout}
        shared={shared}
        theme={theme}
        embedded={false}
      />
    </Canvas>
  )
})
