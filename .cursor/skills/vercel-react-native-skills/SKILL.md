---
name: vercel-react-native-skills
description: React Native and Expo best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules. Triggers on tasks involving React Native, Expo, mobile performance, or native platform APIs.
---

# Vercel React Native Skills

Comprehensive best practices for React Native and Expo applications. Contains rules across multiple categories covering performance, animations, UI patterns, and platform-specific optimizations.

## When to Apply

Reference these guidelines when:

- Building React Native or Expo apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring monorepo projects with native dependencies

## Rule Categories by Priority

| Priority | Category        | Impact   | Prefix             |
| -------- | --------------- | -------- | ------------------ |
| 1        | List Performance| CRITICAL | `list-performance-`|
| 2        | Animation       | HIGH     | `animation-`       |
| 3        | Navigation      | HIGH     | `navigation-`      |
| 4        | UI Patterns     | HIGH     | `ui-`              |
| 5        | State Management| MEDIUM   | `react-state-`     |
| 6        | Rendering       | MEDIUM   | `rendering-`       |
| 7        | Monorepo        | MEDIUM   | `monorepo-`        |
| 8        | Configuration   | LOW      | `fonts-`, `imports-` |

## Quick Reference

### 1. List Performance (CRITICAL)

- `list-performance-virtualize` - Use FlashList or LegendList for large lists
- `list-performance-item-memo` - Memoize list item components
- `list-performance-callbacks` - Stabilize callback references (useCallback)
- `list-performance-inline-objects` - Avoid inline style/object props in renderItem
- `list-performance-function-references` - Extract functions outside render
- `list-performance-images` - Use compressed thumbnails in lists
- `list-performance-item-expensive` - Move expensive work outside items
- `list-performance-item-types` - Use getItemType for heterogeneous lists

### 2. Animation (HIGH)

- `animation-gpu-properties` - Animate only transform and opacity
- `animation-derived-value` - Use useDerivedValue for computed animations
- `animation-gesture-detector-press` - Use Gesture.Tap instead of Pressable for animated feedback

### 3. Navigation (HIGH)

- `navigation-native-navigators` - Use native stack and native tabs over JS navigators

### 4. UI Patterns (HIGH)

- `ui-expo-image` - Use expo-image for all images
- `ui-image-gallery` - Use Galeria for image lightboxes
- `ui-pressable` - Use Pressable over TouchableOpacity
- `ui-safe-area-scroll` - Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` - Use contentInset for headers
- `ui-menus` - Use native context menus
- `ui-native-modals` - Use native modals when possible
- `ui-measure-views` - Use onLayout, not measure()
- `ui-styling` - Use StyleSheet.create or Nativewind

### 5. State Management (MEDIUM)

- `react-state-minimize` - Minimize state subscriptions
- `react-state-dispatcher` - Use dispatcher pattern for callbacks
- `react-state-fallback` - Show fallback on first render
- `react-compiler-destructure-functions` - Destructure for React Compiler
- `react-compiler-reanimated-shared-values` - Use .get()/.set() for shared values with compiler

### 6. Rendering (MEDIUM)

- `rendering-text-in-text-component` - Wrap strings in Text components
- `rendering-no-falsy-and` - Avoid `{value &&}` when value can be 0 or ""

### 7. Monorepo (MEDIUM)

- `monorepo-native-deps-in-app` - Keep native dependencies in app package
- `monorepo-single-dependency-versions` - Use single versions across packages

### 8. Configuration (LOW)

- `fonts-config-plugin` - Use config plugins for custom fonts
- `imports-design-system-folder` - Organize design system imports
- `js-hoist-intl` - Hoist Intl object creation

## Critical Patterns

**Core rendering:** Never use `{value && <Component />}` when value can be 0 or ""—use ternary or `!!value &&`. Always wrap strings in `<Text>`.

**Lists:** Use FlashList or LegendList, not ScrollView with map. Pass primitives to memoized items. Avoid inline objects in renderItem.

**Animation:** Animate only `transform` and `opacity`. Use `useDerivedValue` for computed values. Prefer `GestureDetector` for press states with Reanimated.

## Additional Resources

For detailed explanations, code examples, and edge cases, see [reference.md](reference.md).

Source: Adapted from [vercel-labs/vercel-skills](https://github.com/vercel-labs/vercel-skills) (MIT).
