import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Defs, ClipPath, Path, Image as SvgImage, G, Rect } from 'react-native-svg';
import { PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { createPieceSvgPath } from '../utils/jigsawPathGenerator';
import { COLORS } from '../../../core/theme/colors';

interface PuzzleBoardProps {
  gameState: PuzzleGameState;
  activeHintPieceId: number | null;
  selectedPieceId: number | null;
  onSlotPress: (targetPiece: PuzzlePieceModel) => void;
  onBoardLayout?: (layout: { x: number; y: number; width: number; height: number }) => void;
}

export const PuzzleBoard = React.memo<PuzzleBoardProps>(({
  gameState,
  activeHintPieceId,
  selectedPieceId,
  onSlotPress,
  onBoardLayout,
}) => {
  const { boardWidth, boardHeight, gridSize, pieces, imageUri } = gameState;
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;

  return (
    <View
      onLayout={(e) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        onBoardLayout?.({ x, y, width, height });
      }}
      style={[styles.container, { width: boardWidth, height: boardHeight }]}
    >
      <Svg width={boardWidth} height={boardHeight} style={StyleSheet.absoluteFill}>
        <Defs>
          {pieces.map((piece) => {
            const pathData = createPieceSvgPath(
              piece.targetX,
              piece.targetY,
              pieceWidth,
              pieceHeight,
              piece.edges
            );
            return (
              <ClipPath key={`clip-${piece.id}`} id={`clip-${piece.id}`}>
                <Path d={pathData} />
              </ClipPath>
            );
          })}
        </Defs>

        {/* Tahta zemin deseni */}
        <Rect
          x="0"
          y="0"
          width={boardWidth}
          height={boardHeight}
          fill={COLORS.boardBg}
          stroke={COLORS.surfaceBorder}
          strokeWidth="2"
        />

        {/* Parçalar ve Yuvalar */}
        {pieces.map((piece) => {
          const pathData = createPieceSvgPath(
            piece.targetX,
            piece.targetY,
            pieceWidth,
            pieceHeight,
            piece.edges
          );

          if (piece.isPlaced) {
            return (
              <G key={`placed-${piece.id}`}>
                <G clipPath={`url(#clip-${piece.id})`}>
                  <SvgImage
                    href={{ uri: imageUri }}
                    x="0"
                    y="0"
                    width={boardWidth}
                    height={boardHeight}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </G>
                <Path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                />
              </G>
            );
          }

          const isHintActive = activeHintPieceId === piece.id;

          return (
            <Path
              key={`slot-${piece.id}`}
              d={pathData}
              fill={isHintActive ? 'rgba(251, 191, 36, 0.3)' : 'none'}
              stroke={isHintActive ? '#FBBF24' : COLORS.boardGrid}
              strokeWidth={isHintActive ? '2.5' : '1'}
              strokeDasharray={isHintActive ? '4,4' : undefined}
            />
          );
        })}
      </Svg>

      {/* Dokunulabilir Slot Alanları */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {pieces.map((piece) => {
          if (piece.isPlaced) return null;

          return (
            <TouchableOpacity
              key={`touch-${piece.id}`}
              activeOpacity={0.7}
              onPress={() => onSlotPress(piece)}
              style={[
                styles.slotTouchArea,
                {
                  left: piece.targetX,
                  top: piece.targetY,
                  width: pieceWidth,
                  height: pieceHeight,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.boardBg,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  slotTouchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
