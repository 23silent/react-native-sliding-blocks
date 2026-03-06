# React Native Best Practices — Reference

## Why-Did-You-Render Setup

Enable in development only. Import at app root (`index.js`):

```ts
import React from 'react';

const useWDYR = __DEV__;

if (useWDYR) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    include: [],
    exclude: [],
  });
}
```

## Reference Equality

- **Value types** (number, string, boolean): compared by value; `7 === 7` is true
- **Reference types** (object, array, function): compared by reference; `{} === {}` is false

Native components pass props over the bridge. Memoization ensures props are only sent when they change (shallow comparison).

## Forward-propagating Functions

Prefer passing the function reference when it matches the handler signature:

```jsx
// Bad
<PressableOpacity onPress={() => props.logoutUser()} />

// Good
<PressableOpacity onPress={props.logoutUser} />
```

## Deep Equality Hooks

When dependencies are objects recreated each render, use deep-equality variants:

```js
import { useDeepEffect, useDeepMemo, useDeepCallback } from 'react-native-best-practice';

useDeepEffect(() => { /* ... */ }, [recreatedDeepObject]);
```

Hooks: `useDeepEffect`, `useDeepMemo`, `useDeepCallback`, `useDeepImperativeHandle`, `useDeepLayoutEffect`

Utils: `isEqual`, `cloneDeep`

## State Management Details

- **Redux**: Use [reselect](https://github.com/reduxjs/reselect) for memoized selectors
- **Context**: Use [use-context-selector](https://github.com/dai-shi/use-context-selector) to avoid re-renders when unrelated context values change
- **Recommended**: Recoil, Jotai, Zustand

## Currency and Number Formatting

Create a reusable `NumberFormat` instance instead of calling `toLocaleString()` repeatedly for ~2x performance:

```js
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
formatter.format(1234.56);
```

## Custom Text Component

Create a typography abstraction instead of raw `<Text>` with repeated font/size/color props. Add an ESLint rule to warn when using raw `Text`.

## Exceptions

- Reanimated styles from `useAnimatedStyle` must be dynamic; do not memoize
- Components with rapidly changing props may not benefit from `React.memo`

## Performance Profiling

- [FLASHLIGHT](https://docs.flashlight.dev/) for Android performance scores
- [Profiling guide](https://www.callstack.com/blog/profiling-react-native-apps-with-ios-and-android-tools)

## Remove console.log in Production

Use [babel-plugin-transform-remove-console](https://babeljs.io/docs/en/babel-plugin-transform-remove-console) or similar to strip `console.log` in release builds.
