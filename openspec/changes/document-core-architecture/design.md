## Context

The project is a React Native sliding blocks game library. Architecture is MVVM: engine (RxJS, React-agnostic) ← bridge (RxJS → SharedValues) ← ui (Skia, SharedValues). Current documentation lives in `src/CONCEPTS.md`. This change introduces formal OpenSpec specs as the source of truth.

## Goals / Non-Goals

**Goals:**

- Create baseline specs for game-engine, bridge, ui-components, and game-mechanics
- Align spec content with existing CONCEPTS.md and implementation
- Enable future spec-driven changes (propose → apply → archive)

**Non-Goals:**

- No code changes
- No tests or implementation verification
- No changes to exported API or behavior

## Decisions

| Decision | Rationale |
|----------|-----------|
| Four capabilities: game-engine, bridge, ui-components, game-mechanics | Maps to architecture layers + user-visible behavior. Keeps specs focused. |
| Use ADDED Requirements only | No existing specs; all requirements are new. |
| Reference CONCEPTS.md as source | Single source of architectural truth; specs formalize it. |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Specs drift from code over time | Archive changes with sync; use `/opsx:verify` when implementing. |
| Over-specification of internal details | Focus on observable behavior and contracts; avoid implementation minutiae. |
