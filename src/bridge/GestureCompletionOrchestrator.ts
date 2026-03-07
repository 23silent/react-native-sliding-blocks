import { useCallback,useRef } from 'react'

import type { CompleteEndResult,PathSegment } from '../engine'
import { createPipeline } from '../engine/core/pipeline'

/**
 * Orchestrates gesture-complete flow: pipeline result storage and post-snap middlewares.
 * Runs middlewares (e.g. slide sound, onComplete) after snap animation finishes.
 */
export type GestureCompletionOrchestratorApi = {
  providePipelineResult: (result: CompleteEndResult) => void
  onSnapAnimationComplete: () => void
  onOverlayFadeOutComplete: () => void
}

export type GestureCompletionOrchestratorOptions = {
  onComplete: (updated?: PathSegment[][]) => void
  onOverlayFadeOutComplete: () => void
}

export function useGestureCompletionOrchestrator(
  options: GestureCompletionOrchestratorOptions
): GestureCompletionOrchestratorApi {
  const {
    onComplete,
    onOverlayFadeOutComplete: onOverlayFadeOutCompleteCb
  } = options
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
