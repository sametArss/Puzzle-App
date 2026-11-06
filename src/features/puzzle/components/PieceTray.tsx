import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layers, Compass, Grid } from 'lucide-react-native';
import { PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { DraggablePiece } from './DraggablePiece';
import { COLORS } from '../../../core/theme/colors';

interface PieceTrayProps {
  gameState: PuzzleGameState;
  selectedPieceId: number | null;
  draggingPieceId: number | null;
  onPieceSelect: (pieceId: number) => void;
  onDragStart: (piece: PuzzlePieceModel, pageX: number, pageY: number) => void;
  onDragMove: (pageX: number, pageY: number) => void;
  onDragEnd: (piece: PuzzlePieceModel, pageX: number, pageY: number) => void;
}

type FilterMode = 'ALL' | 'EDGES' | 'INNER';

export const PieceTray = React.memo<PieceTrayProps>(({
  gameState,
  selectedPieceId,
  draggingPieceId,
  onPieceSelect,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');

  const unplacedPieces = useMemo(
    () => gameState.pieces.filter((p) => !p.isPlaced),
    [gameState.pieces]
  );

  const filteredPieces = useMemo(() => {
    if (filterMode === 'EDGES') {
      return unplacedPieces.filter(
        (p) =>
          p.edges.top === 'FLAT' ||
          p.edges.right === 'FLAT' ||
          p.edges.bottom === 'FLAT' ||
          p.edges.left === 'FLAT'
      );
    }
    if (filterMode === 'INNER') {
      return unplacedPieces.filter(
        (p) =>
          p.edges.top !== 'FLAT' &&
          p.edges.right !== 'FLAT' &&
          p.edges.bottom !== 'FLAT' &&
          p.edges.left !== 'FLAT'
      );
    }
    return unplacedPieces;
  }, [unplacedPieces, filterMode]);

  return (
    <View style={styles.container}>
      {/* 1. Üst Kontrol & Filtre Çubuğu */}
      <View style={styles.topBar}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Havuz</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {unplacedPieces.length}/{gameState.pieces.length}
            </Text>
          </View>
        </View>

        {/* Filtreler */}
        <View style={styles.filterGroup}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterMode('ALL')}
            style={[styles.filterButton, filterMode === 'ALL' && styles.filterButtonActive]}
          >
            <Grid size={11} color={filterMode === 'ALL' ? '#fff' : COLORS.textMuted} />
            <Text style={[styles.filterText, filterMode === 'ALL' && styles.filterTextActive]}>
              Tümü
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterMode('EDGES')}
            style={[styles.filterButton, filterMode === 'EDGES' && styles.filterButtonActive]}
          >
            <Compass size={11} color={filterMode === 'EDGES' ? '#fff' : COLORS.textMuted} />
            <Text style={[styles.filterText, filterMode === 'EDGES' && styles.filterTextActive]}>
              Kenar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterMode('INNER')}
            style={[styles.filterButton, filterMode === 'INNER' && styles.filterButtonActive]}
          >
            <Layers size={11} color={filterMode === 'INNER' ? '#fff' : COLORS.textMuted} />
            <Text style={[styles.filterText, filterMode === 'INNER' && styles.filterTextActive]}>
              İç
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Parça Masası */}
      <View style={styles.traySurface}>
        {filteredPieces.length === 0 ? (
          <View style={styles.emptyFilterBox}>
            <Text style={styles.emptyFilterText}>
              Bu filtrede parça bulunmuyor.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            scrollEnabled={draggingPieceId === null}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.piecesScroll}
          >
            {filteredPieces.map((piece) => (
              <DraggablePiece
                key={`tray-drag-${piece.id}`}
                piece={piece}
                gameState={gameState}
                isSelected={selectedPieceId === piece.id}
                isBeingDragged={draggingPieceId === piece.id}
                onPress={() => onPieceSelect(piece.id)}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  countText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  filterGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  traySurface: {
    height: 100,
    justifyContent: 'center',
    backgroundColor: COLORS.trayBg,
    marginHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    overflow: 'hidden',
  },
  piecesScroll: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  emptyFilterBox: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFilterText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
