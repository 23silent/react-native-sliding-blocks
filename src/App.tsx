import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { GameRootView } from './components/GameRootView'

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <ImageBackground
          source={require('./assets/bg.jpg')}
          style={styles.imageBackground}
          resizeMode="stretch">
          <View style={styles.container}>
            <GameRootView />
          </View>
        </ImageBackground>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255, 0.3)'
  },
  imageBackground: {
    flex: 1
  }
})
