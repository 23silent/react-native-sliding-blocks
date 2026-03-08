# Delta for game-mechanics

## ADDED Requirements

### Requirement: Configurable grid

The system SHALL support a configurable grid with `rowsCount`, `columnsCount`, `padding`, `explosionPoolSize`, and `keysSize`. The grid layout SHALL be determined at creation time.

#### Scenario: Grid dimensions

- **WHEN** the game is configured with `rowsCount: 10`, `columnsCount: 8`
- **THEN** the grid displays 10 rows and 8 columns
- **AND** cell size is computed from available space and padding

### Requirement: Block sliding and row clear

The system SHALL allow users to drag blocks horizontally. When a row is completely filled, it SHALL be cleared and blocks above SHALL drop.

#### Scenario: Horizontal slide

- **WHEN** the user pans a block left or right within bounds
- **THEN** the block snaps to the nearest valid column on release
- **AND** `onFitComplete` is called with `hadActualFit: true` if the block moved

#### Scenario: Row clear and cascade

- **WHEN** a row is fully filled
- **THEN** that row is marked for removal
- **AND** `onRemovingStart` is called (host can play sound)
- **AND** after removal animation, blocks above drop
- **AND** score is updated

### Requirement: Callbacks for host integration

The system SHALL invoke host callbacks for score change, game over, pause, restart, sound hooks, and related events. The host SHALL provide these callbacks; the library SHALL never invoke platform APIs directly.

#### Scenario: Score and game over

- **WHEN** a row is cleared
- **THEN** `onScoreChange(score)` is called with the new total

- **WHEN** the game ends (no more room for blocks)
- **THEN** `onGameOver(score)` is called with the final score

#### Scenario: Sound hooks

- **WHEN** rows enter removal
- **THEN** `onRemovingStart({ hasSuper })` is called so the host can play clear sound

- **WHEN** slide animation completes and blocks actually moved
- **THEN** `onFitComplete({ hadActualFit: true })` is called so the host can play slide sound

### Requirement: Super segments and combos

The system SHALL support super (black) segments. When a super segment is cleared, it SHALL also wipe overlapping blocks in adjacent rows for combo scoring.

#### Scenario: Super segment clear

- **WHEN** a row containing a super segment is cleared
- **THEN** `onRemovingStart({ hasSuper: true })` is called
- **AND** overlapping blocks in adjacent rows are also removed
- **AND** combo score is applied
