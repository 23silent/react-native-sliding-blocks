import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  InteractionManager,
  StyleSheet,
  View
} from 'react-native'

import { GameRootView } from '../components/GameRootView'
import { PreloaderOverlay } from '../components/PreloaderOverlay'
import { LOADING_OVERLAY } from '../model/layoutConsts'

type Props = {
  onMenuPress: () => void
}

/**
 * Shows a lightweight preloader on first frame, then mounts the heavy GameRootView
 * after the preloader has painted. Preloader stays visible for POST_LOAD_DELAY_MS
 * after the game reports load complete.
 */
export function GameScreen({ onMenuPress }: Props): React.JSX.Element {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const postLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onLoadProgress = useCallback((p: number) => setProgress(p), [])
  const onLoadComplete = useCallback(() => {
    postLoadTimerRef.current = setTimeout(() => {
      postLoadTimerRef.current = null
      setReady(true)
    }, LOADING_OVERLAY.POST_LOAD_DELAY_MS)
  }, [])

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setShowGame(true)
    })
    return () => task.cancel()
  }, [])

  useEffect(
    () => () => {
      if (postLoadTimerRef.current != null) {
        clearTimeout(postLoadTimerRef.current)
        postLoadTimerRef.current = null
      }
    },
    []
  )

  return (
    <View style={styles.container}>
      {showGame && (
        <GameRootView
          blockRenderMode="skia"
          onMenuPress={onMenuPress}
          onLoadProgress={onLoadProgress}
          onLoadComplete={onLoadComplete}
        />
      )}
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
