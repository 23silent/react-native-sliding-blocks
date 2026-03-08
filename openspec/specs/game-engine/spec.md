# game-engine

### Requirement: React-agnostic engine

The game engine SHALL have no React or Reanimated imports. It MUST be testable without a renderer and reusable from non-React code.

#### Scenario: Engine composition

- **WHEN** the engine is instantiated
- **THEN** it exposes RxJS streams and methods only
- **AND** it has no dependency on React or Reanimated

#### Scenario: Headless testing

- **WHEN** running tests without a React environment
- **THEN** the engine can be created and its streams observed
- **AND** game logic executes without any UI binding

### Requirement: ViewModels and RxJS streams

The engine SHALL compose ViewModels that expose RxJS streams for score, multiplier, items, gesture bounds, and related state. All presentation logic SHALL use RxJS only.

#### Scenario: Stream emission

- **WHEN** game state changes (score update, row clear, gesture)
- **THEN** the corresponding stream emits the new value
- **AND** subscribers receive updates in order

#### Scenario: Pipeline-driven flow

- **WHEN** the gesture pipeline completes (snap animation finished)
- **THEN** the task pipeline runs with prepared tasks (remove, add, etc.)
- **AND** each task applies score, state, and waits for animation completion

### Requirement: Single entry point for gesture completion

The engine SHALL expose a single method for the view to call when a gesture completes: `engine.onGestureComplete(updated)`. The engine SHALL apply the gesture result, run the task pipeline, and clear gesture state.

#### Scenario: Gesture completion flow

- **WHEN** the view calls `engine.onGestureComplete(updated)`
- **THEN** the engine applies the gesture to items
- **AND** the task pipeline processes remove/add steps
- **AND** gesture state (active, translateX) is cleared when done

### Requirement: No side effects in engine

The engine SHALL NOT invoke sound, analytics, or other host-side effects. All side effects SHALL be delegated to the host via callbacks invoked by the bridge.

#### Scenario: Host callbacks only at bridge

- **WHEN** the engine processes a row clear or snap
- **THEN** the engine updates streams only
- **AND** the bridge (not the engine) invokes host callbacks such as `onRemovingStart` or `onFitComplete`

### Requirement: Configurable step-complete timeouts

The engine SHALL accept optional `animOverrides` in `createGameEngine` options (`removeFadeMs`, `itemDropMs`). These override the default animation durations used for step-complete timeout fallbacks so they match the bridge's animation durations.
