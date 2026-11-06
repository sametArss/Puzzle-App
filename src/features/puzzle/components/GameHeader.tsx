import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Lightbulb, Clock, Move } from 'lucide-react-native';
import { COLORS } from '../../../core/theme/colors';

interface GameHeaderProps {
  timeElapsed: number;
  moves: number;
  hintsRemaining: number;
  onUseHint: () => void;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  timeElapsed,
  moves,
  hintsRemaining,
  onUseHint,
  onBack,
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.header}>
      {/* Geri Butonu */}
      <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.iconButton}>
        <ArrowLeft size={22} color={COLORS.text} />
      </TouchableOpacity>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Clock size={15} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.statText}>{formatTime(timeElapsed)}</Text>
        </View>

        <View style={styles.statBadge}>
          <Move size={15} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.statText}>{moves} Hamle</Text>
        </View>
      </View>

      {/* Yardım / İpucu Butonu (3 Hak) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onUseHint}
        disabled={hintsRemaining <= 0}
        style={[
          styles.hintButton,
          hintsRemaining <= 0 && styles.hintButtonDisabled,
        ]}
      >
        <Lightbulb
          size={18}
          color={hintsRemaining > 0 ? '#FBBF24' : COLORS.textMuted}
          style={{ marginRight: 4 }}
        />
        <View style={styles.hintBadge}>
          <Text style={styles.hintBadgeText}>{hintsRemaining}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  hintButtonDisabled: {
    opacity: 0.4,
    borderColor: 'transparent',
  },
  hintBadge: {
    backgroundColor: '#FBBF24',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
});
