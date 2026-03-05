import React, { PropsWithChildren, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Easing, SharedValue, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { CELL_SIZE } from '../../consts'
import { PathSegment } from '../../types'
import { nop } from '../../utils/nop'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { RootViewModel } from '../GameRootView/viewModel'
import { ViewModel } from './viewModel'

export type GameLayout = {
  contentTop: number
  gameAreaX: number
  gameAreaY: number
  actionsBarLeft: number
  actionsBarWidth: number
}

type GameGestureViewProps = PropsWithChildren<{
  translateX: SharedValue<number>
  layout: GameLayout
  rootViewModel: RootViewModel
  onTapOrRestart: (x: number, y: number) => boolean
}>

export const GameGestureView = ({
  children,
  translateX,
  layout,
  rootViewModel,
  onTapOrRestart
}: GameGestureViewProps) => {
  const [viewModel] = useState(() => new ViewModel(rootViewModel))

  const onBegin = viewModel.onBegin
  const onChange = viewModel.onChange
  const onEnd = viewModel.onEnd

  const onCompleteEnd = (updated: PathSegment[][] | undefined) => {
    rootViewModel.setActiveItem(undefined)
    viewModel.onAnimationFinish()
    if (updated) rootViewModel.onCompleteGesture(updated)
  }

  const handleTapOrRestart = (x: number, y: number) => {
    if (!onTapOrRestart(x, y)) {
      onEnd()
    }
  }

  useEffect(() => {
    viewModel.setContainerLayout({ x: layout.gameAreaX, y: layout.gameAreaY })
  }, [layout.gameAreaX, layout.gameAreaY])

  useEffect(() => {
    const disposeBag = new DisposeBag()
    BinderHook()
      .bindAction(viewModel.onChangeTranslateX$, value => {
        translateX.value = value
      })
      .bindAction(viewModel.onCompleteEnd$, ({ to, updated }) => {
        translateX.value = withTiming(
          to * CELL_SIZE,
          { duration: 50, easing: Easing.ease },
          finished => finished && scheduleOnRN(onCompleteEnd, updated)
        )
      })
      .bindAction(viewModel.otherSubs$, nop)
      .disposeBy(disposeBag)

    return () => disposeBag.dispose()
  }, [])

  const tap = Gesture.Tap().onEnd(e =>
    scheduleOnRN(handleTapOrRestart, e.absoluteX, e.absoluteY)
  )
  const pan = Gesture.Pan()
    .onBegin(e => scheduleOnRN(onBegin, { absoluteX: e.absoluteX, absoluteY: e.absoluteY }))
    .onChange(e => scheduleOnRN(onChange, { changeX: e.changeX }))
    .onEnd(() => scheduleOnRN(onEnd))

  const gesture = Gesture.Race(pan, tap)

  return (
    <View style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </View>
  )
}
