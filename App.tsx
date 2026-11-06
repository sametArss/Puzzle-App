import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { DifficultyLevel, PuzzleGameState } from './src/core/types/puzzle.types';
import { COLORS } from './src/core/theme/colors';

type ScreenType = 'HOME' | 'GAME' | 'COLLECTION';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');

  const [newGameParams, setNewGameParams] = useState<{
    imageUri: string;
    gridSize: DifficultyLevel;
  } | null>(null);

  const [resumeGameState, setResumeGameState] = useState<PuzzleGameState | null>(null);

  // Yeni oyun başlat
  const handleStartNewGame = (imageUri: string, gridSize: DifficultyLevel) => {
    setResumeGameState(null);
    setNewGameParams({ imageUri, gridSize });
    setCurrentScreen('GAME');
  };

  // Kaldığı yerden devam et
  const handleResumeGame = (savedState: PuzzleGameState) => {
    setNewGameParams(null);
    setResumeGameState(savedState);
    setCurrentScreen('GAME');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Şık ve Modern Açılış Ekranı (Beyaz ekranı tamamen engeller) */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Ana Ekranlar */}
      {currentScreen === 'HOME' && (
        <HomeScreen
          onStartNewGame={handleStartNewGame}
          onResumeGame={handleResumeGame}
          onOpenCollection={() => setCurrentScreen('COLLECTION')}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen
          initialState={resumeGameState}
          newGameParams={newGameParams ?? undefined}
          onGoHome={() => setCurrentScreen('HOME')}
          onGoCollection={() => setCurrentScreen('COLLECTION')}
        />
      )}

      {currentScreen === 'COLLECTION' && (
        <CollectionScreen onBack={() => setCurrentScreen('HOME')} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
