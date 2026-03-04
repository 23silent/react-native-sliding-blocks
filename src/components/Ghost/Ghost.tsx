import { Image, type SkImage } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import { useDerivedValue } from 'react-native-reanimated'

import { CELL_SIZE } from '../../consts'
import { useItemSharedValues } from '../../hooks/useItemSharedValues'
import type { BlockMap } from '../../types'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { RootViewModel } from '../GameRootView/viewModel'

type GhostProps = {
  rootViewModel: RootViewModel
  block: BlockMap
}

export const Ghost = ({
  rootViewModel,
  block
}: GhostProps): React.JSX.Element => {
  const shared = useItemSharedValues()

  useEffect(() => {
    const binder = BinderHook()
    const disposeBag = new DisposeBag()

    binder
      .bindAction(rootViewModel.activeItem$, item => {
        if (item) {
          shared.color.value = item.color
          shared.translateX.value = item.left
          shared.translateY.value = item.top
          shared.opacity.value = 0.4
          shared.width.value = item.width
        } else {
          shared.color.value = 'transparent'
          shared.translateX.value = -1
          shared.translateY.value = -1
          shared.opacity.value = 0
          shared.width.value = 0
        }
      })
      .disposeBy(disposeBag)

    return () => disposeBag.dispose()
  }, [])

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
