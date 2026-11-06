import React from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import Svg, { Defs, ClipPath, Path, Image as SvgImage, G } from 'react-native-svg';
import { PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { createPieceSvgPath } from '../utils/jigsawPathGenerator';
import { COLORS } from '../../../core/theme/colors';

export const DRAG_FINGER_OFFSET_Y = 24;

interface DragOverlayPieceProps {
  piece: PuzzlePieceModel;
  gameState: PuzzleGameState;
  pan: Animated.ValueXY;
}

export const DragOverlayPiece = React.memo<DragOverlayPieceProps>(({
  piece,
  gameState,
  pan,
}) => {
  const { boardWidth, boardHeight, gridSize, imageUri } = gameState;
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;

  const overflow = Math.min(pieceWidth, pieceHeight) * 0.28;
  const containerWidth = pieceWidth + overflow * 2;
  const containerHeight = pieceHeight + overflow * 2;

  const pathData = createPieceSvgPath(
    piece.targetX,
    piece.targetY,
    pieceWidth,
    pieceHeight,
    piece.edges
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlayContainer,
        {
          width: containerWidth,
          height: containerHeight,
          transform: [
            { translateX: Animated.subtract(pan.x, containerWidth / 2) },
            { translateY: Animated.subtract(pan.y, containerHeight / 2 + DRAG_FINGER_OFFSET_Y) },
          ],
        },
      ]}
    >
      <View style={styles.shadowWrapper}>
        <Svg
          width={containerWidth}
          height={containerHeight}
          viewBox={`${piece.targetX - overflow} ${piece.targetY - overflow} ${containerWidth} ${containerHeight}`}
        >
          <Defs>
            <ClipPath id={`overlay-clip-${piece.id}`}>
              <Path d={pathData} />
            </ClipPath>
          </Defs>

          <G clipPath={`url(#overlay-clip-${piece.id})`}>
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
            stroke={COLORS.secondary}
            strokeWidth="3"
          />
        </Svg>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999999,
    elevation: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowWrapper: {
    transform: [{ scale: 1.12 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});
