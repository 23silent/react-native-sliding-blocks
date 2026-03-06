import React, { useCallback, useState } from 'react'
import { BackHandler } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { CanvasErrorBoundary } from './components/CanvasErrorBoundary'
import type { Route } from './navigation/types'
import { GameScreen } from './screens/GameScreen'
import { HomeScreen } from './screens/HomeScreen'
import { ScoreBoardScreen } from './screens/ScoreBoardScreen'
import { SettingsScreen } from './screens/SettingsScreen'

function App(): React.JSX.Element {
  const [route, setRoute] = useState<Route>('home')

  const goHome = useCallback(() => setRoute('home'), [])

  React.useEffect(() => {
    if (route === 'home') return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setRoute('home')
      return true
    })
    return () => sub.remove()
  }, [route])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CanvasErrorBoundary>
          {route === 'home' && (
            <HomeScreen onNavigate={setRoute} />
          )}
          {route === 'game' && (
            <GameScreen onMenuPress={goHome} />
          )}
          {route === 'settings' && (
            <SettingsScreen onBack={goHome} />
          )}
          {route === 'scoreboard' && (
            <ScoreBoardScreen onBack={goHome} />
          )}
        </CanvasErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
