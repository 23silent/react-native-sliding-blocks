import React, { memo, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedProps,
  useSharedValue
} from 'react-native-reanimated'

import {
  CELL_SIZE,
  COLUMNS_COUNT,
  KEYS,
  PADDING,
  ROWS_COUNT
} from '../../consts'
import { useBlocks } from '../../hooks/useBlocks'
import { BinderHook, DisposeBag } from '../../utils/rx'
import { GameGestureView } from '../GameGestureView'
import { Ghost } from '../Ghost'
import { Grid } from '../Grid'
import { Indicator } from '../Indicator'
import { Item } from '../Item'
import { ItemViewModel } from '../Item/viewModel'
import { RootViewModel } from './viewModel'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

export const GameRootView = memo((): React.JSX.Element => {
  const translateX = useSharedValue(0)

  const [rootViewModel] = useState(() => new RootViewModel())
  const restart = rootViewModel.restart

  const score = useSharedValue(0)
  const multiplier = useSharedValue(0)

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

  const animatedScoreText = useAnimatedProps(() => ({
    text: `${score.value}`,
    defaultValue: `${score.value}`
  }))
  const animatedMultiplierText = useAnimatedProps(() => ({
    text: `${multiplier.value}`,
    defaultValue: `${multiplier.value}`
  }))

  const block = useBlocks()

  return (
    <>
      <View style={styles.actionsContainer}>
        <Pressable onPress={restart} style={styles.restartButton}>
          <Text style={styles.actionLabel}>Restart</Text>
        </Pressable>
        <View style={styles.scoreColumn}>
          <Text style={styles.actionLabel}>Score</Text>
          <AnimatedTextInput
            style={styles.scoreInput}
            animatedProps={animatedScoreText}
            editable={false}
          />
        </View>
        <View style={styles.scoreColumn}>
          <Text style={styles.actionLabel}>Multiplier</Text>
          <AnimatedTextInput
            style={styles.scoreInput}
            animatedProps={animatedMultiplierText}
            editable={false}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <GameGestureView
        translateX={translateX}
        style={styles.gameContainer}
        rootViewModel={rootViewModel}
      >
        <Grid />
        <Indicator rootViewModel={rootViewModel} translateX={translateX} />
        <Ghost rootViewModel={rootViewModel} block={block} />
        {KEYS.map(key => (
          <Item
            key={key}
            block={block}
            translateX={translateX}
            viewModel={new ItemViewModel(key, rootViewModel)}
          />
        ))}
      </GameGestureView>
    </>
  )
})

const styles = StyleSheet.create({
  actionsContainer: {
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginHorizontal: PADDING,
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: PADDING / 2,
    padding: PADDING / 2,
    borderRadius: 10
  },
  actionLabel: {
    color: 'white'
  },
  divider: {
    height: 12
  },
  gameContainer: {
    width: CELL_SIZE * COLUMNS_COUNT,
    height: CELL_SIZE * ROWS_COUNT,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  restartButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 10
  },
  scoreColumn: {
    alignItems: 'center'
  },
  scoreInput: {
    color: 'white',
    padding: 0
  }
})
