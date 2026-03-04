import type { SharedValue } from 'react-native-reanimated'
import { useSharedValue } from 'react-native-reanimated'

import { CELL_SIZE, ROWS_COUNT } from '../consts'

export type ItemSharedValues = {
  translateX: SharedValue<number>
  translateY: SharedValue<number>
  opacity: SharedValue<number>
  width: SharedValue<number>
  color: SharedValue<string>
}

export const useItemSharedValues = (): ItemSharedValues => ({
  translateX: useSharedValue(-1 * CELL_SIZE),
  translateY: useSharedValue(ROWS_COUNT * CELL_SIZE),
  opacity: useSharedValue(1),
  width: useSharedValue(0),
  color: useSharedValue('#fff')
})
