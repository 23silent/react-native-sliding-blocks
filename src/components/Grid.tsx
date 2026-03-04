import { Rect } from '@shopify/react-native-skia'

import { CELL_SIZE, COLUMNS_COUNT, ROWS_COUNT } from '../consts'

export const Grid = () => {
  return [...new Array(ROWS_COUNT)].map((_, rowIndex) => {
    return [...new Array(COLUMNS_COUNT)].map((_, colIndex) => (
      <Rect
        key={`${colIndex}-${rowIndex}`}
        x={colIndex * CELL_SIZE}
        y={rowIndex * CELL_SIZE}
        width={CELL_SIZE}
        height={CELL_SIZE}
        opacity={
          rowIndex % 2
            ? colIndex % 2
              ? 0.2
              : 0.3
            : !(colIndex % 2)
              ? 0.2
              : 0.3
        }
      />
    ))
  })
}
