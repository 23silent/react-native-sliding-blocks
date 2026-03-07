import { useRef } from 'react'
import { Easing, withTiming } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { combineLatest } from 'rxjs'
import { startWith } from 'rxjs/operators'

import type { GameConfig } from '../config'
import { ANIM, type IGameEngine,type PathSegmentExt, SegmentState } from '../engine'
import { BinderHook } from '../engine/core/binding'
import { nop } from '../engine/utils/nop'
import type { GestureCompletionOrchestratorApi } from './GestureCompletionOrchestrator'
import {
  applyRemovingAnimation,
  applySlotBaseUpdates,
  applyWillRemovePulse,
  createItemToStateValue} from './itemsBridgeHelpers'
import type { SharedValuesMap } from './useSharedValuesMap'
import { useStreamBridge } from './useStreamBridge'

export type RemovingPayload = { hasSuper: boolean }

export type EngineBridgeOptions = {
  orchestrator: GestureCompletionOrchestratorApi
  config: GameConfig
  onScoreChange?: (score: number) => void
  onGameOver?: (score: number) => void
  onRemovingStart?: (payload: RemovingPayload) => void
  onRemovingEnd?: (payload: RemovingPayload) => void
  onFitStart?: () => void
  onFitComplete?: (payload: { hadActualFit: boolean }) => void
}

export function useEngineBridge(
  engine: IGameEngine,
  shared: SharedValuesMap,
  options: EngineBridgeOptions
): void {
  const {
    orchestrator,
    config,
    onScoreChange,
    onGameOver,
    onRemovingStart,
    onRemovingEnd,
    onFitStart,
    onFitComplete
  } = options
  const { cellSize, keys, explosionPoolSize } = config
  const itemToStateValue = createItemToStateValue(config)
  const nextPoolIndexRef = useRef(0)
  const batchIdRef = useRef(0)
  const removingPendingRef = useRef(0)
  const removingHasSuperRef = useRef(false)

  useStreamBridge(
    disposeBag => {
      let prevItems: Partial<Record<string, PathSegmentExt>> = {}

      BinderHook()
        .bindAction(engine.score$, v => {
          shared.score.value = v
          onScoreChange?.(v)
        })
        .bindAction(engine.multiplier$, v => {
          shared.multiplier.value = v
        })
        .bindAction(engine.onChangeTranslateX$, v => {
          shared.translateX.value = v
        })
        .bindAction(engine.gestureBounds$, bounds => {
          if (bounds) {
            shared.gesture.active.value = true
            shared.gesture.minPx.value = bounds.minPx
            shared.gesture.maxPx.value = bounds.maxPx
          } else {
            shared.gesture.active.value = false
          }
        })
        .bindAction(engine.onCompleteEnd$, ({ to, updated }) => {
          onFitStart?.()
          orchestrator.providePipelineResult({ to, updated })
          const hadActualFit = !!updated
          const targetPx = to * cellSize
          const onSnapDone = () => {
            onFitComplete?.({ hadActualFit })
            orchestrator.onSnapAnimationComplete()
          }
          if (to === 0) {
            shared.translateX.value = 0
            scheduleOnRN(onSnapDone)
          } else {
            shared.translateX.value = withTiming(
              targetPx,
              {
                duration: ANIM.COMPLETE_SNAP,
                easing: Easing.ease
              },
              finished => finished && scheduleOnRN(onSnapDone)
            )
          }
        })
        .bindAction(engine.activeItem$, item => {
          shared.indicator.width.value = item ? item.width : -1
          shared.indicator.left.value = item ? item.left : -1
          shared.indicator.opacity.value = withTiming(item ? 0.1 : 0)
          if (item) {
            shared.ghost.color.value = item.color
            shared.ghost.translateX.value = item.left
            shared.ghost.translateY.value = item.top
            shared.ghost.opacity.value = 0.4
            shared.ghost.width.value = item.width
          } else {
            shared.ghost.color.value = 'transparent'
            shared.ghost.translateX.value = -1
            shared.ghost.translateY.value = -1
            shared.ghost.opacity.value = 0
            shared.ghost.width.value = 0
          }
        })
        .bindAction(engine.gameOver$, value => {
          if (value) {
            onGameOver?.(value.score)
            shared.overlay.gameOverScore.value = value.score
            shared.overlay.opacity.value = withTiming(1, {
              duration: ANIM.GAME_OVER_IN
            })
          } else {
            shared.overlay.opacity.value = withTiming(
              0,
              { duration: ANIM.GAME_OVER_OUT },
              finished =>
                finished && scheduleOnRN(orchestrator.onOverlayFadeOutComplete)
            )
          }
        })
        .bindAction(engine.gesturePipeline$, nop)
        .disposeBy(disposeBag)

      const itemsSub = combineLatest([
        engine.items$,
        engine.activeItem$.pipe(startWith(undefined))
      ]).subscribe(([items, activeItem]) => {
        batchIdRef.current += 1
        const thisBatch = batchIdRef.current
        const pendingCounter = { current: 0 }

        const onComplete = () => {
          if (batchIdRef.current !== thisBatch) return
          pendingCounter.current -= 1
          if (pendingCounter.current <= 0) {
            engine.signalStepComplete()
          }
        }

        let willRemoveHasSuper = false

        const batchContext = {
          pendingCounter,
          onComplete
        }

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          const slot = shared.items[key]
          if (!slot) continue

          const item = items[key]
          const prevItem = prevItems[key]
          const st = itemToStateValue(item)
          const isActiveSlot =
            !!activeItem && !!item && activeItem.id === item.id

          applySlotBaseUpdates(slot, st, isActiveSlot, batchContext)

          const wasWillRemove = prevItem?.state === SegmentState.WillRemove
          const isWillRemove = item?.state === SegmentState.WillRemove
          const wasRemoving = prevItem?.state === SegmentState.Removing
          const isRemoving = item?.state === SegmentState.Removing

          if (!wasWillRemove && isWillRemove) {
            willRemoveHasSuper = willRemoveHasSuper || !!item?.super
            applyWillRemovePulse(slot, batchContext)
          } else if (!wasRemoving && isRemoving && item) {
            applyRemovingAnimation(
              key,
              slot,
              item,
              shared,
              cellSize,
              explosionPoolSize,
              nextPoolIndexRef,
              removingPendingRef,
              removingHasSuperRef,
              thisBatch,
              batchIdRef,
              engine,
              onRemovingEnd
            )
          } else if (!st.opacityControlledByAnimation) {
            slot.opacity.value = st.opacityValue
          }
        }

        const anyWillRemove = keys.some(key => {
          const item = items[key]
          const prev = prevItems[key]
          return (
            item?.state === SegmentState.WillRemove &&
            prev?.state !== SegmentState.WillRemove
          )
        })
        if (anyWillRemove) {
          onRemovingStart?.({ hasSuper: willRemoveHasSuper })
        }
        prevItems = items

        if (pendingCounter.current <= 0) {
          engine.signalStepComplete()
        }
      })
      disposeBag.add(itemsSub)
    },
    [engine, config]
  )
}
