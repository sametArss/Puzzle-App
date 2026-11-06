import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { SpinningPuzzleLogo } from '../components/common/SpinningPuzzleLogo';
import { COLORS } from '../core/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Giriş Animasyonu (Fade In + Scale Up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // İlerleme Çizgisi
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Belirli bir süre sonra yumuşak Fade Out ile çıkış
    const exitTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => clearTimeout(exitTimer);
  }, [fadeAnim, scaleAnim, progressAnim, onFinish]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Arka Plan Atmosfer Parıltısı */}
      <View style={styles.ambientGlow} />

      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        {/* Dönen Neon Puzzle Logosu */}
        <SpinningPuzzleLogo size={130} />

        {/* Marka Başlığı */}
        <Text style={styles.title}>JIGSAW STUDIO</Text>
        <Text style={styles.tagline}>Kendi Dünyanı Parçala & Birleştir</Text>

        {/* Minimal Yükleme Çizgisi */}
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingBar, { width: progressWidth }]} />
        </View>
      </Animated.View>

      {/* Alt Versiyon / Stüdyo İmzası */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>OFFLINE & PRIVATE JIGSAW</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999999,
  },
  ambientGlow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: (SCREEN_WIDTH * 0.85) / 2,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginTop: 20,
    textShadowColor: 'rgba(99, 102, 241, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 28,
  },
  loadingTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 34,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
});
