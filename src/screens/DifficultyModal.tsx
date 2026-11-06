import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Sparkles, Zap, Flame, Crown } from 'lucide-react-native';
import { DifficultyLevel } from '../core/types/puzzle.types';
import { COLORS } from '../core/theme/colors';

interface DifficultySelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (level: DifficultyLevel) => void;
}

export const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const levels: {
    level: DifficultyLevel;
    title: string;
    piecesText: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      level: 3,
      title: 'Başlangıç',
      piecesText: '3x3 (9 Parça)',
      description: 'Hızlı ve keyifli bir ısınma turu',
      icon: <Sparkles size={22} color="#10B981" />,
      color: '#10B981',
    },
    {
      level: 4,
      title: 'Kolay',
      piecesText: '4x4 (16 Parça)',
      description: 'Klasik ve rahatlatıcı puzzle deneyimi',
      icon: <Zap size={22} color="#6366F1" />,
      color: '#6366F1',
    },
    {
      level: 6,
      title: 'Orta',
      piecesText: '6x6 (36 Parça)',
      description: 'Detaylı ve sürükleyici bir meydan okuma',
      icon: <Flame size={22} color="#F59E0B" />,
      color: '#F59E0B',
    },
    {
      level: 8,
      title: 'Usta (64 Parça)',
      piecesText: '8x8 (64 Parça)',
      description: 'Gerçek puzzle ustaları için zihin egzersizi',
      icon: <Crown size={22} color="#EC4899" />,
      color: '#EC4899',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Zorluk Seviyesi Seç</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Fotoğrafını kaç parçaya bölmek istersin?
          </Text>

          {/* Seviye Kartları */}
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {levels.map((item) => (
              <TouchableOpacity
                key={item.level}
                activeOpacity={0.8}
                onPress={() => onSelect(item.level)}
                style={[styles.levelCard, { borderLeftColor: item.color, borderLeftWidth: 4 }]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}15` }]}>
                  {item.icon}
                </View>
                <View style={styles.levelInfo}>
                  <View style={styles.levelTitleRow}>
                    <Text style={styles.levelTitle}>{item.title}</Text>
                    <Text style={[styles.piecesBadge, { color: item.color }]}>
                      {item.piecesText}
                    </Text>
                  </View>
                  <Text style={styles.levelDesc}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    padding: 16,
    borderRadius: 16,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  piecesBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  levelDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
