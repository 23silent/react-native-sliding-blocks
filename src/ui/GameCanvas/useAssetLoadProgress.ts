import { useEffect, useMemo, useRef } from 'react'

import { LOADING_OVERLAY } from '../../constants/layout'
import { cancelIdle, scheduleIdle } from '../utils/scheduleIdle'

/**
 * Shared asset loading progress logic for GameCanvas and GameAreaCanvas.
 * Reports progress to callback and fires onLoadComplete after a minimum display
 * delay, using idle scheduling.
 */
export function useAssetLoadProgress(
  totalAssets: number,
  loadedAssets: number,
  onLoadProgress?: (progress: number) => void,
  onLoadComplete?: () => void
): void {
  const progress = useMemo(
    () => loadedAssets / totalAssets,
    [loadedAssets, totalAssets]
  )
  const isAssetsReady = progress >= 1
  const completedRef = useRef(false)
  const idleRef = useRef<number | null>(null)

  useEffect(() => {
    onLoadProgress?.(progress)
  }, [progress, onLoadProgress])

  useEffect(() => {
    if (!isAssetsReady || !onLoadComplete || completedRef.current) return
    const t = setTimeout(() => {
      idleRef.current = scheduleIdle(() => {
        if (!completedRef.current) {
          completedRef.current = true
          onLoadComplete()
        }
      })
    }, LOADING_OVERLAY.MIN_DISPLAY_MS)
    return () => {
      clearTimeout(t)
      if (idleRef.current != null) {
        cancelIdle(idleRef.current)
        idleRef.current = null
      }
    }
  }, [isAssetsReady, onLoadComplete])
}
