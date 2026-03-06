import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { LOADING_OVERLAY } from '../model/layoutConsts'

const { BOX_WIDTH, BAR_HEIGHT, BAR_INSET } = LOADING_OVERLAY

const TRACK_WIDTH = BOX_WIDTH - BAR_INSET * 2
const FILL_ANIMATION_DURATION = 400

type Props = {
  progress: number
}

/**
 * RN-based preloader — renders instantly on first frame (no Skia/Canvas delay).
 * Progress bar animates smoothly so progress changes are clearly visible.
 */
export function PreloaderOverlay({ progress }: Props): React.JSX.Element {
  const fillWidth = useSharedValue(0)

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress))
    fillWidth.value = withTiming(clamped * TRACK_WIDTH, {
      duration: FILL_ANIMATION_DURATION
    })
  }, [progress, fillWidth])

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value
  }))

  return (
    <View style={styles.backdrop}>
      <View style={styles.box}>
        <Text style={styles.title}>Loading...</Text>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, fillStyle]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 12,
    backgroundColor: 'rgba(30,41,59,1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BAR_INSET
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20
  },
  barTrack: {
    width: '100%',
    height: BAR_HEIGHT,
    borderRadius: 4,
    backgroundColor: 'rgba(15,23,42,1)',
    overflow: 'hidden'
  },
  barFill: {
    height: BAR_HEIGHT,
    backgroundColor: 'rgba(59,130,246,0.95)',
    borderRadius: 4
  }
})
