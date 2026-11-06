import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, G, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../core/theme/colors';

interface SpinningPuzzleLogoProps {
  size?: number;
}

export const SpinningPuzzleLogo: React.FC<SpinningPuzzleLogoProps> = ({ size = 110 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Sonsuz yumuşak dönüş animasyonu (14 saniyede 1 tam tur)
    const spinLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 2. Havada süzülme / nefes alma (Pulse & Float) animasyonu
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    spinLoop.start();
    floatLoop.start();

    return () => {
      spinLoop.stop();
      floatLoop.stop();
    };
  }, [rotateAnim, floatAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1.04],
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View style={[styles.container, { width: size + 30, height: size + 30 }]}>
      {/* Arka Plan Neon Parlama Halesi */}
      <View
        style={[
          styles.glow,
          {
            width: size * 1.1,
            height: size * 1.1,
            borderRadius: (size * 1.1) / 2,
          },
        ]}
      />

      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }, { scale }, { translateY }],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Circle cx="50" cy="50" r="46" fill="url(#centerGlow)" />

          {/* 4 Birbirine Kilitli Renkli Jigsaw Parçası */}
          {/* 1. Sol Üst Parça (Indigo / Mor) */}
          <G>
            <Path
              d="M 12 12 L 48 12 L 48 24 C 44 24 40 28 40 32 C 40 36 44 40 48 40 L 48 48 L 38 48 C 38 44 34 40 30 40 C 26 40 22 44 22 48 L 12 48 Z"
              fill={COLORS.primary}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
          </G>

          {/* 2. Sağ Üst Parça (Neon Pembe) */}
          <G>
            <Path
              d="M 52 12 L 88 12 L 88 48 L 78 48 C 78 44 74 40 70 40 C 66 40 62 44 62 48 L 52 48 L 52 40 C 56 40 60 36 60 32 C 60 28 56 24 52 24 Z"
              fill={COLORS.secondary}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
          </G>

          {/* 3. Sağ Alt Parça (Neon Zümrüt Yeşili) */}
          <G>
            <Path
              d="M 52 52 L 62 52 C 62 56 66 60 70 60 C 74 60 78 56 78 52 L 88 52 L 88 88 L 52 88 L 52 76 C 56 76 60 72 60 68 C 60 64 56 60 52 60 Z"
              fill={COLORS.accent}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
          </G>

          {/* 4. Sol Alt Parça (Neon Cyan) */}
          <G>
            <Path
              d="M 12 52 L 22 52 C 22 56 26 60 30 60 C 34 60 38 56 38 52 L 48 52 L 48 60 C 44 60 40 64 40 68 C 40 72 44 76 48 76 L 48 88 L 12 88 Z"
              fill={COLORS.cyan}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
            />
          </G>

          {/* Merkez Parlama Noktası */}
          <Circle cx="50" cy="50" r="3.5" fill="#FFFFFF" opacity="0.8" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(99, 102, 241, 0.16)',
    filter: 'blur(16px)',
  },
});

