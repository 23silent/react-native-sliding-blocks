import {
  Canvas,
  Fill,
  Group,
  Image,
  RoundedRect,
  Text,
  useImage
} from '@shopify/react-native-skia'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useWindowDimensions } from 'react-native'
import {
  CELL_SIZE,
  COLUMNS_COUNT,
  KEYS,
  PADDING,
  ROWS_COUNT
} from '../../consts'
import { useBlocks } from '../../hooks/useBlocks'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { fonts } from '../../utils/fonts'
import { GameGestureView } from '../GameGestureView'
import { GameOverOverlay, hitTestRestart as hitTestGameOverRestart } from '../GameOverOverlay'
import { Ghost } from '../Ghost'
import { Grid } from '../Grid'
import { Indicator } from '../Indicator'
import { Item } from '../Item'
import { ItemViewModel } from '../Item/viewModel'
import { RootViewModel } from './viewModel'

const ACTIONS_BAR_HEIGHT = 70
const DIVIDER_HEIGHT = 12
const GAME_WIDTH = CELL_SIZE * COLUMNS_COUNT
const GAME_HEIGHT = CELL_SIZE * ROWS_COUNT
const getTopRestartBounds = (layout: { contentTop: number; actionsBarLeft: number }) => ({
  left: layout.actionsBarLeft + 10,
  right: layout.actionsBarLeft + 110,
  top: layout.contentTop + 15,
  bottom: layout.contentTop + 55
})

const hitTestTopRestart = (
  x: number,
  y: number,
  layout: { contentTop: number; actionsBarLeft: number }
): boolean => {
  const b = getTopRestartBounds(layout)
  return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom
}

export const GameRootView = memo((): React.JSX.Element => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const translateX = useSharedValue(0)

  const [rootViewModel] = useState(() => new RootViewModel())
  const itemViewModels = useMemo(
    () =>
      KEYS.reduce(
        (acc, key) => {
          acc[key] = new ItemViewModel(key, rootViewModel)
          return acc
        },
        {} as Record<string, ItemViewModel>
      ),
    [rootViewModel]
  )
  const restart = rootViewModel.restart

  const score = useSharedValue(0)
  const multiplier = useSharedValue(0)

  const bgImage = useImage(require('../../assets/bg.jpg'))
  const block = useBlocks()

  const layout = useMemo(() => {
    const contentHeight = ACTIONS_BAR_HEIGHT + DIVIDER_HEIGHT + GAME_HEIGHT
    const contentTop = Math.max(
      insets.top,
      (screenHeight - insets.top - insets.bottom - contentHeight) / 2 +
        insets.top
    )
    const gameAreaY = contentTop + ACTIONS_BAR_HEIGHT + DIVIDER_HEIGHT
    const gameAreaX = (screenWidth - GAME_WIDTH) / 2
    return {
      contentTop,
      gameAreaX,
      gameAreaY,
      actionsBarLeft: (screenWidth - (screenWidth - PADDING * 2)) / 2,
      actionsBarWidth: screenWidth - PADDING * 2
    }
  }, [screenWidth, screenHeight, insets])

  useEffect(() => {
    const binder = BinderHook()
    const disposeBag = new DisposeBag()

    binder
      .bindAction(rootViewModel.score$, value => {
        score.value = value
      })
      .bindAction(rootViewModel.multiplier$, value => {
        multiplier.value = value
      })
      .disposeBy(disposeBag)

    return () => disposeBag.dispose()
  }, [])

  const scoreText = useDerivedValue(() => `${Math.round(score.value)}`)
  const multiplierText = useDerivedValue(() => `${Math.round(multiplier.value)}`)

  return (
    <GameGestureView
      translateX={translateX}
      rootViewModel={rootViewModel}
      layout={layout}
      onTapOrRestart={(x, y) => {
        if (hitTestTopRestart(x, y, layout)) {
          restart()
          return true
        }
        const gameOver = rootViewModel.getGameOver()
        if (
          gameOver &&
          hitTestGameOverRestart(x - layout.gameAreaX, y - layout.gameAreaY)
        ) {
          restart()
          return true
        }
        return false
      }}
    >
      <Canvas style={{ flex: 1 }}>
        {bgImage ? (
          <Image
            image={bgImage}
            x={0}
            y={0}
            width={screenWidth}
            height={screenHeight}
            fit="cover"
          />
        ) : (
          <Fill color="rgba(200,200,200,0.5)" />
        )}
        <Fill color="rgba(255,255,255,0.3)" />
        <Group transform={[{ translateY: layout.contentTop }]}>
          <RoundedRect
            x={layout.actionsBarLeft}
            y={0}
            width={layout.actionsBarWidth}
            height={ACTIONS_BAR_HEIGHT - 20}
            r={10}
            color="rgba(0,0,0,0.4)"
          />
          <Text
            text="Restart"
            font={fonts.button}
            x={layout.actionsBarLeft + 20}
            y={38}
            color="white"
          />
          <Text
            text="Score"
            font={fonts.label}
            x={layout.actionsBarLeft + layout.actionsBarWidth / 2 - 80}
            y={18}
            color="white"
          />
          <Text
            text={scoreText}
            font={fonts.score}
            x={layout.actionsBarLeft + layout.actionsBarWidth / 2 - 60}
            y={42}
            color="white"
          />
          <Text
            text="Multiplier"
            font={fonts.label}
            x={layout.actionsBarLeft + layout.actionsBarWidth / 2 + 10}
            y={18}
            color="white"
          />
          <Text
            text={multiplierText}
            font={fonts.score}
            x={layout.actionsBarLeft + layout.actionsBarWidth / 2 + 30}
            y={42}
            color="white"
          />
        </Group>
        <Group transform={[{ translateX: layout.gameAreaX }, { translateY: layout.gameAreaY }]}>
          <RoundedRect
            x={0}
            y={0}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            r={10}
            color="transparent"
          />
          <Grid />
          <Indicator rootViewModel={rootViewModel} translateX={translateX} />
          <Ghost rootViewModel={rootViewModel} block={block} />
          {KEYS.map(key => (
            <Item
              key={key}
              block={block}
              translateX={translateX}
              viewModel={itemViewModels[key]}
            />
          ))}
          <GameOverOverlay rootViewModel={rootViewModel} />
        </Group>
      </Canvas>
    </GameGestureView>
  )
})
