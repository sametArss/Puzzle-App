import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { SettingsModal } from './src/screens/SettingsModal';
import { useSettings } from './src/features/settings/hooks/useSettings';
import { DifficultyLevel, PuzzleGameState } from './src/core/types/puzzle.types';
import { COLORS } from './src/core/theme/colors';

type ScreenType = 'HOME' | 'GAME' | 'COLLECTION';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  const { settings, toggleSound, toggleHaptics } = useSettings();

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

      {/* 1. Şık ve Modern Açılış Ekranı */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Ana Ekranlar */}
      {currentScreen === 'HOME' && (
        <HomeScreen
          onStartNewGame={handleStartNewGame}
          onResumeGame={handleResumeGame}
          onOpenCollection={() => setCurrentScreen('COLLECTION')}
          onOpenSettings={() => setIsSettingsVisible(true)}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen
          initialState={resumeGameState}
          newGameParams={newGameParams ?? undefined}
          onGoHome={() => setCurrentScreen('HOME')}
          onGoCollection={() => setCurrentScreen('COLLECTION')}
          onOpenSettings={() => setIsSettingsVisible(true)}
        />
      )}

      {currentScreen === 'COLLECTION' && (
        <CollectionScreen onBack={() => setCurrentScreen('HOME')} />
      )}

      {/* 3. Ayarlar Menüsü Modalı */}
      <SettingsModal
        visible={isSettingsVisible}
        settings={settings}
        onToggleSound={toggleSound}
        onToggleHaptics={toggleHaptics}
        onClose={() => setIsSettingsVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
