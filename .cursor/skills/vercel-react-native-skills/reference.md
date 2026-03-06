# Vercel React Native Skills — Reference

Detailed rules with code examples. Read when implementing or debugging specific patterns.

---

## Core Rendering (CRITICAL)

### Never Use && with Potentially Falsy Values

Empty string and 0 are falsy but JSX-renderable. React Native crashes when they render outside `<Text>`.

```tsx
// Bad: crashes if count is 0 or name is ""
{name && <Text>{name}</Text>}
{count && <Text>{count} items</Text>}

// Good: ternary
{name ? <Text>{name}</Text> : null}
{count ? <Text>{count} items</Text> : null}

// Good: explicit boolean
{!!name && <Text>{name}</Text>}
```

### Wrap Strings in Text Components

Strings must be inside `<Text>`. Direct children of `<View>` crash.

```tsx
// Bad
<View>Hello, {name}!</View>

// Good
<View><Text>Hello, {name}!</Text></View>
```

---

## List Performance

### Use a List Virtualizer

Use FlashList or LegendList instead of ScrollView with map. Virtualizers render only visible items.

```tsx
// Bad: 50 items = 50 components mounted
<ScrollView>
  {items.map((item) => <ItemCard key={item.id} item={item} />)}
</ScrollView>

// Good: only ~10–15 visible
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={80}
/>
```

### Avoid Inline Objects in renderItem

Inline objects break memoization. Pass primitives or the item directly.

```tsx
// Bad
renderItem={({ item }) => (
  <UserRow user={{ id: item.id, name: item.name }} style={{ backgroundColor: item.isActive ? 'green' : 'gray' }} />
)}

// Good
renderItem={({ item }) => <UserRow id={item.id} name={item.name} isActive={item.isActive} />}

const UserRow = memo(function UserRow({ id, name, isActive }) {
  const backgroundColor = isActive ? 'green' : 'gray'
  return <View style={[styles.row, { backgroundColor }]}><Text>{name}</Text></View>
})
```

### Hoist Callbacks for List Items

Create callbacks at the list root; items call with ID.

```tsx
// Bad: new callback every render
renderItem={({ item }) => <Item item={item} onPress={() => handlePress(item.id)} />}

// Good
const handleItemPress = useCallback((id: string) => { /* ... */ }, [])

renderItem={({ item }) => <Item item={item} onPress={() => handleItemPress(item.id)} />}
// Or pass item.id and handle in child
```

### Keep List Items Lightweight

No queries, minimal hooks, no expensive computations. Move data fetching to parent.

```tsx
// Bad: query inside list item
function ProductRow({ id }) {
  const { data } = useQuery(['product', id], fetchProduct)
  return <View>...</View>
}

// Good: parent fetches, passes primitives
function ProductList() {
  const { data: products } = useQuery(['products'], fetchProducts)
  return (
    <FlashList
      data={products}
      renderItem={({ item }) => <ProductRow name={item.name} price={item.price} imageUrl={item.image} />}
    />
  )
}
```

### Use Compressed Images in Lists

Request thumbnails; full-res images cause jank.

```tsx
// Bad: 4000x3000 for 100x100 thumbnail
<Image source={{ uri: product.imageUrl }} style={{ width: 100, height: 100 }} />

// Good: request sized image
const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`
<Image source={{ uri: thumbnailUrl }} style={{ width: 100, height: 100 }} contentFit="cover" />
```

Use expo-image for caching and placeholders.

### Stable Object References

Don't map/filter before passing to lists; new references cause full re-renders. Transform inside items or use stable references.

```tsx
// Bad: new objects on every keystroke
const domains = keyword ? tlds.map((tld) => ({ domain: `${keyword}.${tld.name}` })) : []

// Good: pass raw data, derive in item
<LegendList data={tlds} renderItem={renderItem} />

function DomainItem({ tld }) {
  const domain = useKeywordStore((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

---

## Animation

### Animate Transform and Opacity Only

Avoid animating width, height, top, left, margin, padding—they trigger layout every frame. Use transform and opacity (GPU-accelerated).

```tsx
// Bad: layout on every frame
useAnimatedStyle(() => ({
  height: withTiming(expanded ? 200 : 0),
  overflow: 'hidden',
}))

// Good: GPU-accelerated
useAnimatedStyle(() => ({
  transform: [{ scaleY: withTiming(expanded ? 1 : 0) }],
  opacity: withTiming(expanded ? 1 : 0),
}))
// Use fixed height + transformOrigin: 'top'
```

### Prefer useDerivedValue Over useAnimatedReaction

For computed values in worklets, use useDerivedValue—it runs on the UI thread.

```tsx
// Prefer
const derivedOpacity = useDerivedValue(() => sharedValue.value * 2)

// Over useAnimatedReaction for simple derivations
```

### GestureDetector for Animated Press States

For press feedback with Reanimated, use Gesture.Tap instead of Pressable.

```tsx
// For animated press (scale, opacity), use:
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const scale = useSharedValue(1)
const tap = Gesture.Tap()
  .onBegin(() => { scale.value = withSpring(0.95) })
  .onFinalize(() => { scale.value = withSpring(1) })

<GestureDetector gesture={tap}>
  <Animated.View style={useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))}>
    ...
  </Animated.View>
</GestureDetector>
```

---

## UI Patterns

### Use expo-image

expo-image provides caching, placeholders, and better performance than Image.

```tsx
import { Image } from 'expo-image'

<Image source={{ uri: url }} style={styles.thumb} contentFit="cover" />
```

### Use Pressable Over TouchableOpacity

Pressable is the modern replacement with better feedback control.

### Use contentInset for ScrollView Headers

Instead of wrapping content in a header View, use contentInset for dynamic spacing.

### Use onLayout, Not measure()

For measuring views, use onLayout callback. Avoid measure() when possible.

### Native Modals and Menus

Prefer native modals and context menus over JS-based bottom sheets for performance.

---

## State Management

### Minimize State Subscriptions

Use Zustand selectors instead of Context when possible—selectors only re-render when selected value changes.

```tsx
// Bad: re-renders on any cart change
const { items } = useContext(CartContext)
const inCart = items.includes(id)

// Good: re-renders only when this item's favorited state changes
const inCart = useCartStore((s) => s.items.has(id))
```

### React Compiler: Shared Values

With React Compiler, use `.get()` and `.set()` for Reanimated shared values, not `.value`.

```tsx
// With React Compiler
const opacity = useSharedValue(1)
opacity.set(0.5)
const current = opacity.get()
```

---

## Monorepo

### Native Dependencies in App Package

Install native dependencies in the app package, not in shared packages.

### Single Dependency Versions

Use consistent versions of react-native, expo, and related libs across packages.

---

## Configuration

### Fonts: Config Plugin

Load fonts at build time with expo config plugins.

### Hoist Intl Creation

Create Intl formatters (DateTimeFormat, NumberFormat) outside components or in useMemo to avoid per-render allocation.
