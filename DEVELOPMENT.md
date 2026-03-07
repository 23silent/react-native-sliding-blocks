# Development Guide

How to develop `react-native-sliding-blocks` and see changes in the example app.

---

## Prerequisites

- Node.js ≥ 22.11.0
- [React Native environment setup](https://reactnative.dev/docs/environment-setup) (Xcode for iOS, Android Studio for Android)

---

## Quick Start

```bash
# 1. Install all dependencies (root + example)
yarn install
yarn example

# 2. Start Metro
yarn example:start:dev

# 3. In another terminal, run the app
yarn example:ios      # or
yarn example:android
```

---

## How It Works

The example's `metro.config.js` uses a custom `resolveRequest` to resolve `react-native-sliding-blocks` directly to `../src/index.ts`, bypassing the symlink in `node_modules`. Metro bundles from the real source path (inside `watchFolders`) and should detect file changes. The `file:..` dependency stays for TypeScript and `yarn install`.

---

## If Changes Don't Show Up

1. **Reload the app** — Shake device → **Reload**, or press `r` in the Metro terminal.
2. **Restart Metro with cache reset** — `yarn example:start:dev`.
3. **Clear Watchman** — `watchman watch-del-all`, then restart Metro.
4. **Full reset** (when nothing else works):
   ```bash
   watchman watch-del-all
   rm -rf $TMPDIR/metro-* $TMPDIR/haste-map-* 2>/dev/null
   cd example && rm -rf node_modules && yarn && cd ..
   yarn example:start:dev
   ```

---

## Development Workflow

| Step | Command |
|------|---------|
| Install deps | `yarn install && yarn example` |
| Start Metro | `yarn example:start:dev` (or `yarn example:start`) |
| Run iOS | `yarn example:ios` (in another terminal) |
| Run Android | `yarn example:android` (in another terminal) |
| Lint library | `yarn lint` |

With the Babel alias, changes in `src/` should trigger hot reload. Use `yarn example:start:dev` if Metro seems to serve stale bundles.

---

## If Changes Still Don't Show

1. **Full clean restart**
   ```bash
   # Stop Metro, then:
   cd example
   rm -rf node_modules
   yarn
   cd ..
   yarn example:start:dev
   ```

2. **Clear Metro cache explicitly**
   ```bash
   cd example && yarn start --reset-cache
   ```

3. **iOS: clean build**
   ```bash
   cd example/ios && xcodebuild clean && cd ../..
   yarn example:ios
   ```

4. **Android: clean build**
   ```bash
   cd example/android && ./gradlew clean && cd ../..
   yarn example:android
   ```

---

## Scripts

| Command | Description |
|---------|-------------|
| `yarn example:start:dev` | Start Metro with `--reset-cache` (use if changes don't appear) |
| `yarn example:start` | Start Metro |
| `yarn example:ios` | Run iOS |
| `yarn example:android` | Run Android |
| `yarn example` | Install example dependencies |
| `yarn lint` | Lint library source |
