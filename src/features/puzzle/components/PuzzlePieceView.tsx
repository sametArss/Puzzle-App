import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Defs, ClipPath, Path, Image as SvgImage, G } from 'react-native-svg';
import { PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { createPieceSvgPath } from '../utils/jigsawPathGenerator';
import { COLORS } from '../../../core/theme/colors';

interface PuzzlePieceViewProps {
  piece: PuzzlePieceModel;
  gameState: PuzzleGameState;
  isSelected?: boolean;
  onPress?: () => void;
  scale?: number;
}

export const PuzzlePieceView: React.FC<PuzzlePieceViewProps> = ({
  piece,
  gameState,
  isSelected = false,
  onPress,
  scale = 1,
}) => {
  const { boardWidth, boardHeight, gridSize, imageUri } = gameState;
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;

  // Parçanın kulakçıkları (tab) parça sınırlarından dışarı taşabilir.
  // Bu yüzden ekstra taşma payı (padding) bırakıyoruz.
  const overflow = Math.min(pieceWidth, pieceHeight) * 0.28;
  const containerWidth = pieceWidth + overflow * 2;
  const containerHeight = pieceHeight + overflow * 2;

  // Parçanın SVG path'i (Tahta koordinatlarında hesaplanır)
  const pathData = createPieceSvgPath(
    piece.targetX,
    piece.targetY,
    pieceWidth,
    pieceHeight,
    piece.edges
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        {
          width: containerWidth * scale,
          height: containerHeight * scale,
        },
        isSelected && styles.selectedGlow,
      ]}
    >
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          transform: [{ scale }],
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

          {/* Kesilmiş Fotoğraf Parçası */}
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

          {/* Dış Kontur Çizgisi */}
          <Path
            d={pathData}
            fill="none"
            stroke={isSelected ? COLORS.secondary : 'rgba(255, 255, 255, 0.45)'}
            strokeWidth={isSelected ? '2.5' : '1.2'}
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedGlow: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
  },
});

