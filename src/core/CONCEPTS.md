# Core Concepts (Reusable Across Games)

This folder contains patterns you can reuse when building new React Native games. The goal: **smooth 60fps, no React commits during gameplay, pre-rendered UI**.

---

## 1. No React Commits During Gameplay

**Idea:** Game state never triggers `setState` or `useReducer`. React re-renders only on mount and rare layout changes (rotation, keyboard).

**How:**
- Hold game state in **RxJS streams** (ViewModels)
- Hold UI state in **Reanimated SharedValues**
- A single **bridge** subscribes to RxJS and writes into SharedValues
- Views read SharedValues only → no React state updates from game logic

**Reuse:** Keep ViewModels pure (RxJS). Use `useStreamBridge` to connect them to SharedValues. Never call `setState` from game logic.

---

## 2. Pre-rendered UI

**Idea:** All Skia (or native) nodes exist from the start. Nothing is conditionally mounted from game state.

**How:**
- Declare all Canvas nodes upfront (e.g. 48 item slots, overlay, indicator)
- Use SharedValues for opacity, position, visibility
- No `{condition && <Component />}` that would trigger reconciliation
- Nodes are always in the tree; SharedValues control what’s visible

**Reuse:** Design your Canvas with fixed slots. Use `opacity: 0` or off-screen position for “hidden” elements.

---

## 3. Single Binding Point

**Idea:** One place subscribes all engine streams → SharedValues. No per-component subscriptions.

**How:**
- One hook (e.g. `useEngineBridge`) that receives engine + shared map
- Uses `BinderHook` + `DisposeBag` to subscribe and cleanup
- All RxJS → SharedValue writes happen there

**Reuse:** `BinderHook` and `useStreamBridge` from `core/binding`. Your game’s bridge hook calls them with game-specific mappings.

---

## 4. React-Agnostic Engine

**Idea:** The engine (and ViewModels) have no React or Reanimated imports. Testable without a renderer, reusable from non-React code.

**How:**
- Engine = composition of ViewModels, exposes RxJS streams + methods
- ViewModels use RxJS only
- React is only at the edge: components + bridge hook

**Reuse:** Put game logic in plain TS classes. Keep React in components and the bridge.

---

## 5. MVVM Layering

| Layer    | Responsibility                         | Dependencies   |
|----------|----------------------------------------|----------------|
| **Model**    | Domain logic, types, pure functions     | None           |
| **ViewModels** | Presentation logic, RxJS streams       | Model          |
| **Engine**   | Facade composing ViewModels            | ViewModels     |
| **Binding**  | RxJS → SharedValues (bridge hook)      | Engine, Reanimated |
| **View**     | React components, Skia Canvas          | Binding, SharedValues |

---

## Recipe for a New Game

1. **Model** — Types, game rules, process loop (fit/remove/add or equivalent)
2. **ViewModels** — RxJS streams for state; GestureCoordinator for input
3. **Engine** — Facade that composes ViewModels, exposes streams + methods
4. **SharedValuesMap** — Hook that creates all SharedValues (score, items, overlays, etc.)
5. **Bridge** — Hook that uses `BinderHook` to subscribe engine streams → SharedValues
6. **Canvas** — Pre-rendered Skia nodes, all driven by SharedValues
7. **GestureView** — Gesture handling with `scheduleOnRN` to call engine methods (no object capture in worklets)

Use `core/binding` for BinderHook, DisposeBag, useStreamBridge. Keep game-specific logic in your game module.

---

## 6. Declarative Reactions (Skia/Reanimated)

**Idea:** Define Reanimated reactions (watch SharedValues → apply side effects) in a declarative, reusable way.

**How:**
- `useReactionRule(rule)` — runs one `{ watch, apply }` rule
- `useReactionRules(rules)` — runs multiple rules in one worklet
- `ReactiveSlot` — wrapper; pass `reaction` or `reactions` (array)
- `withReaction(Component, getRuleOrRules)` — HOC; getRule can return a rule or array of rules
- **Presets:** `activeGestureSync`, `fadeWhenInactive`, `syncValue` (see `core/skia/presets`)
- **Slot interfaces:** `GestureSlot`, `HasOpacity`, `HasTranslateX`, etc. (see `core/skia/types`) — implement these so presets work with your components

**Reuse:** Use presets or define custom rules. Rule functions must be worklets (`'worklet'` as first statement). Slot interfaces are minimal so any component implementing them can use presets.

---

## 7. Pipeline Architecture (Gesture & Task)

**Idea:** Two main pipelines drive the game flow. Each uses `createPipeline` from `core/pipeline` with middlewares for side effects (sound, analytics, etc.).

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GESTURE PIPELINE (triggered on pan end)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   User releases finger                                                      │
│         │                                                                   │
│         ▼                                                                   │
│   GestureCoordinator.endValues$  ──►  filter, map  ──►  onCompleteEnd$      │
│         │                                    │                              │
│         │                                    ▼                              │
│         │                          Bridge: snap animation (Reanimated)      │
│         │                                    │                              │
│         │                                    │  onSnapAnimationComplete     │
│         │                                    ▼                              │
│         │                          GestureCompletionOrchestrator            │
│         │                                    │                              │
│         │                          runGesturePipeline(middlewares):         │
│         │                                    ├── playSlideSound             │
│         │                                    └── onComplete ────────────────┼──►
│         │                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                                                              │
                                                                              │
┌─────────────────────────────────────────────────────────────────────────────┐
│ TASK PIPELINE (triggered by onComplete)                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   engine.onGestureComplete(updated)  ◄──────────────────────────────────────┘
│         │                                                                   │
│         ├── game.onCompleteGesture(updated)                                 │
│         │         │                                                         │
│         │         ├── applyGestureResultSync (items$)                       │
│         │         ├── processData.setSegments + doProcess                   │
│         │         │         │                                               │
│         │         │         ▼                                               │
│         │         │   stopProcessing ──► prepareTasks ──► for each task:    │
│         │         │                            │                            │
│         │         │                            │  runTaskApplyPipeline:     │
│         │         │                            │    playRemoveSound         │
│         │         │                            │    updateScore             │
│         │         │                            │    applyState              │
│         │         │                            │    waitForAnimation        │
│         │         │                                                         │
│         └── gesture.onAnimationFinish (clear active, reset translateX)      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Summary

| Pipeline | Trigger | Where | Middlewares |
|----------|---------|-------|-------------|
| **Gesture** | Snap animation finished | GestureCompletionOrchestrator | playSlideSound, onComplete |
| **Task** | onComplete (after gesture) | GameViewModel.applyTask | playRemoveSound, updateScore, applyState, waitForAnimation |

### Entry Point

The view calls a single method: `engine.onGestureComplete(updated)`. The engine applies the gesture, starts the task pipeline, and clears gesture state.

### Reuse

```ts
import { createPipeline, type PipelineMiddleware } from 'core/pipeline'

const myPipeline = createPipeline<MyContext>([
  (ctx, next) => { /* side effect */ return next() },
  (ctx, next) => { /* core logic */ return next() }
])
myPipeline(context)
```

Add new middlewares by extending the arrays in `GestureCompletionOrchestrator` or `TaskPipeline`.

---

## 8. Animation-Driven Flow (No Magic Timeouts)

**Idea:** All timing is driven by gesture completion or animation completion. No `setTimeout` for game logic.

**How:**

- **Gesture pipeline** — Snap animation uses `withTiming(..., finished => onSnapAnimationComplete)`.
- **Step complete** — Bridge counts pending animations per batch; when the last `withTiming`/`withSequence` `finished` callback fires, it calls `signalStepComplete()`.
- **Overlay fade-out** — When restarting from game over, score reset waits for `overlayFadeOutComplete$`, which the bridge emits from `withTiming(0, ..., finished => signalOverlayFadeOutComplete)`.
- **Task pipeline** — Waits for `stepComplete$` (animation-driven). A 3× timer is kept only as a safety fallback.

**Reuse:** Use Reanimated `finished` callbacks and `scheduleOnRN` for JS-side logic. Avoid timeouts for sequencing.
