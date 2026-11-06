import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { Trophy, Clock, Move, ArrowRight, Home } from 'lucide-react-native';
import { CompletedPuzzleItem } from '../../../core/types/collection.types';
import { COLORS } from '../../../core/theme/colors';

interface GameSuccessModalProps {
  visible: boolean;
  item: CompletedPuzzleItem | null;
  onGoHome: () => void;
  onGoCollection: () => void;
}

export const GameSuccessModal: React.FC<GameSuccessModalProps> = ({
  visible,
  item,
  onGoHome,
  onGoCollection,
}) => {
  if (!item) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} dk ${secs} sn`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Kupa Rozeti */}
          <View style={styles.trophyContainer}>
            <Trophy size={42} color="#FBBF24" />
          </View>

          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.subtitle}>Puzzle başarıyla tamamlandı ve koleksiyonuna eklendi.</Text>

          {/* Tamamlanan Fotoğraf Önizlemesi */}
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.imagePreview} />
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.gridSize}x{item.gridSize}</Text>
            </View>
          </View>

          {/* İstatistikler */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Clock size={18} color={COLORS.primary} style={{ marginBottom: 4 }} />
              <Text style={styles.statLabel}>Süre</Text>
              <Text style={styles.statValue}>{formatTime(item.timeElapsed)}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Move size={18} color={COLORS.secondary} style={{ marginBottom: 4 }} />
              <Text style={styles.statLabel}>Hamle</Text>
              <Text style={styles.statValue}>{item.moves}</Text>
            </View>
          </View>

          {/* Aksiyon Butonları */}
          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onGoCollection}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.buttonText}>Koleksiyonu Gör</Text>
              <ArrowRight size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onGoHome}
              style={[styles.button, styles.secondaryButton]}
            >
              <Home size={18} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryButtonText}>Ana Sayfa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  trophyContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  imagePreviewContainer: {
    width: 140,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.surfaceBorder,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});

