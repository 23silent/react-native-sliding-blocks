import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { LOADING_OVERLAY } from '../model/layoutConsts'

const { BOX_WIDTH, BOX_HEIGHT, BAR_HEIGHT, BAR_INSET } = LOADING_OVERLAY

type Props = {
  progress: number
}

/**
 * RN-based preloader — renders instantly on first frame (no Skia/Canvas delay).
 * Fully opaque background for seamless feel.
 */
export function PreloaderOverlay({ progress }: Props): React.JSX.Element {
  const fillWidth = Math.max(0, Math.min(1, progress)) * (BOX_WIDTH - BAR_INSET * 2)

  return (
    <View style={styles.backdrop}>
      <View style={styles.box}>
        <Text style={styles.title}>Loading...</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: fillWidth }]} />
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
