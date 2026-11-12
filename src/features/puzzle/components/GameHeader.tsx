import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Lightbulb, Clock, Move, Settings } from 'lucide-react-native';
import { COLORS } from '../../../core/theme/colors';

interface GameHeaderProps {
  timeElapsed: number;
  moves: number;
  hintsRemaining: number;
  onUseHint: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  timeElapsed,
  moves,
  hintsRemaining,
  onUseHint,
  onOpenSettings,
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

      {/* Sağ Aksiyonlar: İpucu + Ayarlar */}
      <View style={styles.rightActions}>
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

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenSettings}
          style={styles.iconButton}
        >
          <Settings size={19} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    paddingHorizontal: 9,
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
