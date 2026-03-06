import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HOME_SCREEN, MENU_BG } from '../model/layoutConsts'
import type { Route } from '../navigation/types'

type Props = {
  onNavigate: (route: Route) => void
}

export function HomeScreen({ onNavigate }: Props): React.JSX.Element {
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
      <Text style={styles.title}>Sliding Blocks</Text>
      <View style={[styles.buttons, { marginTop: height * 0.08 }]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary,
            pressed && styles.buttonPressed
          ]}
          onPress={() => onNavigate('game')}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed
          ]}
          onPress={() => onNavigate('scoreboard')}
        >
          <Text style={styles.buttonText}>Score Board</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed
          ]}
          onPress={() => onNavigate('settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MENU_BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center'
  },
  buttons: {
    alignItems: 'center',
    gap: HOME_SCREEN.BUTTON_GAP
  },
  button: {
    width: HOME_SCREEN.BUTTON_WIDTH,
    height: HOME_SCREEN.BUTTON_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonPrimary: {
    backgroundColor: 'rgba(59,130,246,0.9)'
  },
  buttonSecondary: {
    backgroundColor: 'rgba(59,130,246,0.35)'
  },
  buttonPressed: {
    opacity: 0.85
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white'
  }
})
