import React, { useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Defs, ClipPath, Path, Image as SvgImage, G } from 'react-native-svg';
import { PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { createPieceSvgPath } from '../utils/jigsawPathGenerator';
import { COLORS } from '../../../core/theme/colors';

export const TRAY_PIECE_BOX_SIZE = 72;

interface DraggablePieceProps {
  piece: PuzzlePieceModel;
  gameState: PuzzleGameState;
  isSelected?: boolean;
  isBeingDragged?: boolean;
  onPress: () => void;
  onDragStart: (piece: PuzzlePieceModel, pageX: number, pageY: number) => void;
  onDragMove: (pageX: number, pageY: number) => void;
  onDragEnd: (piece: PuzzlePieceModel, pageX: number, pageY: number) => void;
}

export const DraggablePiece = React.memo<DraggablePieceProps>(({
  piece,
  gameState,
  isSelected = false,
  isBeingDragged = false,
  onPress,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const { boardWidth, boardHeight, gridSize, imageUri } = gameState;
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;

  const overflow = Math.min(pieceWidth, pieceHeight) * 0.28;
  const containerWidth = pieceWidth + overflow * 2;
  const containerHeight = pieceHeight + overflow * 2;

  const maxDim = Math.max(containerWidth, containerHeight);
  const trayScale = Math.min(1, TRAY_PIECE_BOX_SIZE / maxDim);

  const isDraggingRef = useRef(false);

  const pathData = createPieceSvgPath(
    piece.targetX,
    piece.targetY,
    pieceWidth,
    pieceHeight,
    piece.edges
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,

      // Yukarı veya herhangi bir yöne hafif harekette hemen yakala
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 2 || Math.abs(gesture.dx) > 3;
      },
      onMoveShouldSetPanResponderCapture: (_, gesture) => {
        return gesture.dy < -2 || Math.abs(gesture.dy) > 3;
      },

      onPanResponderGrant: () => {
        isDraggingRef.current = false;
      },

      onPanResponderMove: (e, gesture) => {
        if (!isDraggingRef.current && (Math.abs(gesture.dy) > 2 || Math.abs(gesture.dx) > 3)) {
          isDraggingRef.current = true;
          onDragStart(piece, e.nativeEvent.pageX, e.nativeEvent.pageY);
        } else if (isDraggingRef.current) {
          onDragMove(e.nativeEvent.pageX, e.nativeEvent.pageY);
        }
      },

      onPanResponderRelease: (e, gesture) => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          onDragEnd(piece, e.nativeEvent.pageX, e.nativeEvent.pageY);
        } else {
          onPress();
        }
      },

      onPanResponderTerminate: (e) => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          onDragEnd(piece, e.nativeEvent.pageX, e.nativeEvent.pageY);
        }
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.boxWrapper,
        {
          width: TRAY_PIECE_BOX_SIZE + 6,
          height: TRAY_PIECE_BOX_SIZE + 6,
          opacity: isBeingDragged ? 0.2 : 1,
        },
      ]}
    >
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          transform: [{ scale: trayScale }],
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg
          width={containerWidth}
          height={containerHeight}
          viewBox={`${piece.targetX - overflow} ${piece.targetY - overflow} ${containerWidth} ${containerHeight}`}
        >
          <Defs>
            <ClipPath id={`tray-clip-${piece.id}`}>
              <Path d={pathData} />
            </ClipPath>
          </Defs>

          <G clipPath={`url(#tray-clip-${piece.id})`}>
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
            stroke={isSelected ? COLORS.secondary : 'rgba(255, 255, 255, 0.5)'}
            strokeWidth={isSelected ? '3' : '1.5'}
          />
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  boxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
});
