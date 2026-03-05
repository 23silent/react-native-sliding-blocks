import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { GameRootView } from './components/GameRootView'

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GameRootView />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
