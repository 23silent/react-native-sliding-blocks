import { useRef, useCallback } from 'react'
import SoundPlayer from 'react-native-sound-player'

import { createPipeline } from '../core/pipeline'
import type { PathSegment } from '../model/types'
import type { CompleteEndResult } from '../viewmodels/GestureCoordinator'

/**
 * Orchestrates gesture-complete flow: pipeline result storage and post-snap middlewares.
 * Runs middlewares (e.g. slide sound, onComplete) after snap animation finishes.
 */
export type GestureCompletionOrchestratorApi = {
  providePipelineResult: (result: CompleteEndResult) => void
  onSnapAnimationComplete: () => void
  /** Called when game-over overlay fade-out animation completes. Bridge calls this from worklet. */
  onOverlayFadeOutComplete: () => void
}

export type GestureCompletionOrchestratorOptions = {
  onComplete: (updated?: PathSegment[][]) => void
  onOverlayFadeOutComplete: () => void
}

function playSlideSound(): void {
  try {
    SoundPlayer.playSoundFile('small', 'mp3')
  } catch {
    // ignore
  }
}

export function useGestureCompletionOrchestrator(
  options: GestureCompletionOrchestratorOptions
): GestureCompletionOrchestratorApi {
  const { onComplete, onOverlayFadeOutComplete: onOverlayFadeOutCompleteCb } =
    options
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const onOverlayFadeOutCompleteRef = useRef(onOverlayFadeOutCompleteCb)
  onOverlayFadeOutCompleteRef.current = onOverlayFadeOutCompleteCb

  const pendingRef = useRef<CompleteEndResult | null>(null)

  const providePipelineResult = useCallback((result: CompleteEndResult) => {
    pendingRef.current = result
  }, [])

  const runGesturePipeline = useRef(
    createPipeline<CompleteEndResult>([
      (ctx, next) => {
        if (ctx.updated) playSlideSound()
        return next()
      },
      (ctx, next) => {
        onCompleteRef.current(ctx.updated)
        return next()
      }
    ])
  ).current

  const onSnapAnimationComplete = useCallback(() => {
    const pending = pendingRef.current
    pendingRef.current = null
    if (pending) {
      runGesturePipeline(pending)
    }
  }, [runGesturePipeline])

  const onOverlayFadeOutComplete = useCallback(() => {
    onOverlayFadeOutCompleteRef.current()
  }, [])

  return {
    providePipelineResult,
    onSnapAnimationComplete,
    onOverlayFadeOutComplete
  }
}
