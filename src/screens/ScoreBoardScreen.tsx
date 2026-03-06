import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  onBack: () => void
}

export function ScoreBoardScreen({ onBack }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Pressable
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        onPress={onBack}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Score Board</Text>
      <Text style={styles.placeholder}>No scores yet. Play a game!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.98)',
    paddingHorizontal: 24
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 24
  },
  pressed: {
    opacity: 0.7
  },
  backText: {
    fontSize: 16,
    color: 'rgba(203,213,225,0.9)'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16
  },
  placeholder: {
    fontSize: 16,
    color: 'rgba(203,213,225,0.7)'
  }
})
