# Sliding Blocks Puzzle (React Native)

A **high-performance** puzzle game built with React Native and TypeScript—slide blocks, fill rows, clear them for points, and watch everything cascade down. Runs great on both iOS and Android with smooth 60fps thanks to Skia, Reanimated, and worklets.

React Native is rarely the first tool that comes to mind for game development, but that's precisely what made this an interesting challenge. This project is an attempt to bridge the gap between the declarative UI patterns of React and the performance demands of real-time interaction. I hope it provides a helpful reference for others navigating the same intersection—proving that with the right combination of tools (Skia, Reanimated, and a solid state architecture), you can build experiences that feel far more native than the tech stack might suggest.

## About the App

**Sliding Blocks** is a match-style puzzle where you slide colorful segments around a grid. Fill a row completely and it clears—score points, watch blocks fall with gravity, and new rows keep coming from the top. Simple to pick up, satisfying to master.

### Game Mechanics

- **Grid** — 8 columns × 10 rows of cells
- **Blocks** — Colored segments of varying lengths (1–4 cells). Drag them left or right to reposition.
- **Clearing** — Fill a row completely (8 cells) to clear it. Segments disappear and blocks above drop.
- **Super segments** — Rare black segments that, when cleared, also wipe overlapping blocks in adjacent rows. Handy for chain combos.
- **Score & multiplier** — Animated display so you can track your progress as you go.
- **Restart** — Fresh start whenever you need one.

### Architecture

The app uses an **MVVM-style** setup with RxJS for reactive state. ViewModels hold the game logic; Views subscribe to streams for updates. A `ProcessData` service runs the game loop: fit (gravity) → remove (clear rows) → add (new rows), with gesture handling for drag input. Clean separation of concerns and easy to extend.

## Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React Native 0.84 |
| **Language** | TypeScript 5.8 |
| **React** | React 19.2 |
| **Graphics** | Skia (via `@shopify/react-native-skia`) |
| **Animations** | React Native Reanimated 4.x |
| **Gestures** | React Native Gesture Handler |
| **State / Streams** | RxJS 7.x |
| **Platforms** | iOS, Android |

**Requirements**: Node.js ≥ 22.11.0 (you’ll need this before running the app)

## Performance & Technical Approach

We aimed for **smooth, responsive gameplay** and leaned on a few solid patterns:

- **Skia rendering** — `@shopify/react-native-skia` uses the same 2D engine as Chrome. Drawing happens on the native thread, so we avoid flooding the JS bridge.
- **Reanimated + Worklets** — Animations and gesture feedback run on the UI thread. Touch feels instant, and we steer clear of JS-thread jank.
- **Reactive state** — RxJS streams drive game logic and UI updates. ViewModels keep heavy work off the render path.
- **Batched processing** — The game loop uses batched tasks and binary search for gap/overlap checks, keeping per-frame work light.
- **Memoization** — `memo()` and `useDerivedValue` cut down unnecessary re-renders and recalculations.
- **TypeScript** — Strict typing and clear interfaces for safer refactors and predictable behavior.

All of that adds up to smooth 60fps, snappy touch response, and efficient resource use on both iOS and Android.

## Packages

Here’s what powers the game under the hood:

### Core Dependencies

| Package | Purpose |
|---------|---------|
| `react` / `react-native` | UI framework & native bridge |
| `@shopify/react-native-skia` | Skia-based 2D graphics & canvas |
| `react-native-reanimated` | High-performance animations |
| `react-native-gesture-handler` | Touch and gesture handling |
| `react-native-worklets` | Run JS on UI thread |
| `rxjs` | Reactive streams for game state |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-svg` | SVG support |
| `react-native-sound-player` | Audio playback |

### Dev Dependencies

- **Build / tooling**: `@react-native-community/cli`, `@react-native/babel-preset`, `@react-native/metro-config`
- **TypeScript**: `typescript`, `@react-native/typescript-config`, `@tsconfig/react-native`
- **Linting**: `eslint`, `prettier`, `@typescript-eslint/*`, `eslint-plugin-simple-import-sort`, `eslint-plugin-unused-imports`
- **Testing**: `react-test-renderer`, `@types/react-test-renderer`

## Project Structure

A quick overview of where things live:

```
├── src/
│   ├── App.tsx                 # App root, providers, background
│   ├── components/
│   │   ├── GameRootView/       # Main game UI, score, restart, layout
│   │   ├── GameGestureView/    # Gesture handling, pan/tap, container
│   │   ├── Grid.tsx            # Skia grid overlay
│   │   ├── Ghost/              # Ghost preview of selected block
│   │   ├── Indicator/          # Visual feedback
│   │   └── Item/               # Block rendering & animation
│   ├── hooks/                  # useBlocks (block assets)
│   ├── services/
│   │   └── processData.ts      # Game loop: fit, remove, add
│   ├── utils/                  # fit, remove, generate, rx, delay, etc.
│   ├── consts.ts               # Grid size, cell size, config
│   └── types.ts                # PathSegment, ProcessorState, etc.
├── ios/                        # iOS native project
├── android/                    # Android native project
├── index.js                    # Entry point
└── app.json                    # App metadata
```

## Getting Started

Clone the repo, install dependencies, and you're good to go:

```bash
# Install dependencies
yarn install
# or: npm install

# Start Metro bundler
yarn start

# Run on iOS (in another terminal)
yarn ios

# Or run on Android
yarn android
```

Make sure you have the React Native environment set up for [iOS](https://reactnative.dev/docs/environment-setup) or [Android](https://reactnative.dev/docs/environment-setup). Then fire up the app and enjoy.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start Metro bundler |
| `yarn ios` | Run on iOS simulator/device |
| `yarn android` | Run on Android emulator/device |
| `yarn lint` | Run ESLint on source files |

## Plans / TODO

- **Improve design** — Polish UI, theming, and visual feedback (e.g. clear animations, particle effects).
- **Persist state** — Save game state (and optionally high score) so players can resume or compare runs.
- **Better score calculation** — Richer scoring (combo bonuses, super-segment rewards, difficulty scaling).
- **Sound & haptics** — Tie in `react-native-sound-player` and haptic feedback for clears and moves.
- **Difficulty / settings** — Configurable grid size, speed, or difficulty levels for replayability.

## License

MIT License — free for personal and commercial use. Go ahead and tinker, share, or build on it.
