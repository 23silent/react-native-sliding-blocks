import { Rect } from '@shopify/react-native-skia'
import React from 'react'

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
 * Renders a checkerboard grid pattern.
 * Used by game canvas for the playing field background.
 */
export function CheckerboardGrid({
  rows,
  cols,
  cellSize,
  baseColor = DEFAULT_BASE_COLOR,
  darkOpacity = DEFAULT_DARK_OPACITY,
  lightOpacity = DEFAULT_LIGHT_OPACITY
}: Props): React.JSX.Element {
  const cells: React.ReactNode[] = []
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const opacity =
        rowIndex % 2
          ? colIndex % 2
            ? darkOpacity
            : lightOpacity
          : !(colIndex % 2)
            ? darkOpacity
            : lightOpacity
      cells.push(
        <Rect
          key={`${colIndex}-${rowIndex}`}
          x={colIndex * cellSize}
          y={rowIndex * cellSize}
          width={cellSize}
          height={cellSize}
          color={baseColor}
          opacity={opacity}
        />
      )
    }
  }
  return <>{cells}</>
}
