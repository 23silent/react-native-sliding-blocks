import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { GameRootView } from '../components/GameRootView'
import { PreloaderOverlay } from '../components/PreloaderOverlay'

type Props = {
  onMenuPress: () => void
}

/**
 * Wraps GameRootView with an RN preloader that shows on first frame.
 * Preloader is fully opaque — no transparency. Hides only when load is complete
 * and the game has painted (no stutters).
 */
export function GameScreen({ onMenuPress }: Props): React.JSX.Element {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  const onLoadProgress = useCallback((p: number) => setProgress(p), [])
  const onLoadComplete = useCallback(() => setReady(true), [])

  return (
    <View style={styles.container}>
      <GameRootView
        blockRenderMode="skia" 
        onMenuPress={onMenuPress}
        onLoadProgress={onLoadProgress}
        onLoadComplete={onLoadComplete}
      />
      {!ready && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-only">
          <PreloaderOverlay progress={progress} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
