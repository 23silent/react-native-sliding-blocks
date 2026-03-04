import { Image, type SkImage } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { CELL_SIZE } from '../../consts'
import { useItemSharedValues } from '../../hooks/useItemSharedValues'
import type { BlockMap } from '../../types'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { ItemViewModel } from './viewModel'
import { scheduleOnRN } from 'react-native-worklets'

type ItemProps = {
  translateX?: SharedValue<number>
  viewModel: ItemViewModel
  block: BlockMap
}

export const Item = ({
  viewModel,
  translateX,
  block
}: ItemProps): React.JSX.Element | null => {
  const shared = useItemSharedValues()

  const isActive = useSharedValue(false)
  const initialLeft = useSharedValue(-1)

  const removeItem = viewModel.removeItem

  useEffect(() => {
    const binder = BinderHook()
    const disposeBag = new DisposeBag()

    binder
      .bindAction(viewModel.state$, st => {
        shared.translateX.value = st.xValue
        shared.translateY.value = withTiming(st.yValue, { duration: 200 })
        shared.opacity.value = st.opacityValue
        shared.width.value = st.widthValue
        shared.color.value = st.colorValue

        initialLeft.value = st.xValue
      })
      .bindAction(viewModel.removeTrigger$, () => {
        shared.opacity.value = withTiming(0, { duration: 400 }, finished => {
          if (finished) scheduleOnRN(removeItem)
        })
      })
      .bindAction(viewModel.isActive$, value => {
        isActive.value = value
      })
      .disposeBy(disposeBag)

    return () => disposeBag.dispose()
  }, [])

  useAnimatedReaction(
    () => ({ tx: translateX?.value, isActive: isActive.value }),
    ({ tx, isActive }) => {
      if (isActive && tx !== undefined) {
        shared.translateX.value = initialLeft.value + tx
      }
    }
  )

  const image = useDerivedValue<SkImage | null>(() => {
    const color = shared.color.value
    const size = Math.round(shared.width.value / CELL_SIZE)
    return (block?.[color]?.[size - 1] ?? null) as SkImage | null
  }, [block])

  return (
    <Image
      image={image}
      fit="contain"
      x={shared.translateX}
      y={shared.translateY}
      width={shared.width}
      height={CELL_SIZE}
      opacity={shared.opacity}
    />
  )
}
