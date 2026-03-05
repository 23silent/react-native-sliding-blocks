import { Rect } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { CELL_SIZE, ROWS_COUNT } from '../../consts'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { RootViewModel } from '../GameRootView/viewModel'

type Props = {
  translateX: SharedValue<number>
  rootViewModel: RootViewModel
}

export const Indicator = (props: Props): React.JSX.Element | null => {
  const opacity = useSharedValue(0)
  const activeItemWidth = useSharedValue(-1)
  const activeItemLeft = useSharedValue(-1)

  useEffect(() => {
    const disposeBag = new DisposeBag()
    BinderHook()
      .bindAction(props.rootViewModel.activeItem$, value => {
        activeItemWidth.value = value ? value.width : -1
        activeItemLeft.value = value ? value.left : -1
        opacity.value = withTiming(value ? 0.1 : 0)
      })
      .disposeBy(disposeBag)

    return () => disposeBag.dispose()
  }, [])

  const translateX = useDerivedValue(
    () => activeItemLeft.value + props.translateX.value
  )

  return (
    <Rect
      key="indicator"
      x={translateX}
      y={0}
      width={activeItemWidth}
      height={CELL_SIZE * ROWS_COUNT}
      color="blue"
      opacity={opacity}
    />
  )
}
