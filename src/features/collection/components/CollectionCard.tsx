import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Trash2, Clock, Move } from 'lucide-react-native';
import { CompletedPuzzleItem } from '../../../core/types/collection.types';
import { COLORS } from '../../../core/theme/colors';

interface CollectionCardProps {
  item: CompletedPuzzleItem;
  onDelete: (id: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ item, onDelete }) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}dk ${secs}sn`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {/* Görsel */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{item.gridSize}x{item.gridSize}</Text>
        </View>
      </View>

      {/* Bilgiler */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          >
            <Trash2 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={13} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.statText}>{formatTime(item.timeElapsed)}</Text>
          </View>
          <View style={styles.statItem}>
            <Move size={13} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
            <Text style={styles.statText}>{item.moves} Hamle</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surfaceLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  difficultyText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});

