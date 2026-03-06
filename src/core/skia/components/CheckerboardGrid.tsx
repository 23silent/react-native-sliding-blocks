import { Group, Picture, Skia } from '@shopify/react-native-skia'
import React, { memo, useMemo } from 'react'
import { useDerivedValue } from 'react-native-reanimated'

type Props = {
  rows: number
  cols: number
  cellSize: number
  baseColor?: string
  /** Opacity for dark cells (odd row + even col, or even row + odd col) */
  darkOpacity?: number
  /** Opacity for light cells */
  lightOpacity?: number
}

const DEFAULT_BASE_COLOR = 'rgba(0,0,0,1)'
const DEFAULT_DARK_OPACITY = 0.2
const DEFAULT_LIGHT_OPACITY = 0.3

/**
 * Renders a checkerboard grid pattern as a single Skia Picture.
 * Drawing happens on the UI thread in a worklet - no 80 React nodes, no JS-thread render cost.
 */
export const CheckerboardGrid = memo(function CheckerboardGrid({
  rows,
  cols,
  cellSize,
  baseColor = DEFAULT_BASE_COLOR,
  darkOpacity = DEFAULT_DARK_OPACITY,
  lightOpacity = DEFAULT_LIGHT_OPACITY
}: Props): React.JSX.Element {
  const paint = useMemo(() => Skia.Paint(), [])
  const recorder = useMemo(() => Skia.PictureRecorder(), [])

  const picture = useDerivedValue(() => {
    'worklet'
    const width = cols * cellSize
    const height = rows * cellSize
    const canvas = recorder.beginRecording(Skia.XYWHRect(0, 0, width, height))

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const opacity =
          rowIndex % 2
            ? colIndex % 2
              ? darkOpacity
              : lightOpacity
            : colIndex % 2
              ? lightOpacity
              : darkOpacity
        paint.setColor(Skia.Color(baseColor))
        paint.setAlphaf(opacity)
        canvas.drawRect(
          Skia.XYWHRect(
            colIndex * cellSize,
            rowIndex * cellSize,
            cellSize,
            cellSize
          ),
          paint
        )
      }
    }

    return recorder.finishRecordingAsPicture()
  }, [
    rows,
    cols,
    cellSize,
    baseColor,
    darkOpacity,
    lightOpacity,
    recorder,
    paint
  ])

  return (
    <Group>
      <Picture picture={picture} />
    </Group>
  )
})
