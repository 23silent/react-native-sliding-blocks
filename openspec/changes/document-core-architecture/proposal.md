## Why

The codebase has detailed architecture documentation in `src/CONCEPTS.md` but no formal OpenSpec specs. To cover the code by specs and enable spec-driven development for future changes, we need an initial baseline: formal requirements and scenarios that describe how the system behaves. This establishes the source of truth in `openspec/specs/` for the core architecture.

## What Changes

- Create baseline specs for the core architecture (engine, bridge, UI)
- Document requirements and scenarios for game mechanics, binding flow, and rendering
- No code changes—documentation only

## Capabilities

### New Capabilities

- `game-engine`: Pure game logic layer—RxJS streams, no React; grid state, process pipeline (fit/remove/add), ViewModels
- `bridge`: RxJS → SharedValues binding; single binding point; bridge hook, GestureCompletionOrchestrator
- `ui-components`: React components, Skia Canvas, SharedValues-driven rendering; pre-rendered UI, no React commits during gameplay
- `game-mechanics`: User-visible behavior—grid layout, blocks, row clear, scoring, gestures, callbacks

### Modified Capabilities

- None (no existing specs)

## Impact

- New directory: `openspec/specs/game-engine/`, `openspec/specs/bridge/`, `openspec/specs/ui-components/`, `openspec/specs/game-mechanics/`
- Reference: `src/CONCEPTS.md` as source material
- No impact on runtime code or APIs
