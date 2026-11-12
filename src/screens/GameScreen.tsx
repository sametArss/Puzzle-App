import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { HelpCircle, Eye } from 'lucide-react-native';
import { PuzzleGameState, PuzzlePieceModel, DifficultyLevel } from '../core/types/puzzle.types';
import { usePuzzleGame } from '../features/puzzle/hooks/usePuzzleGame';
import { PuzzleBoard } from '../features/puzzle/components/PuzzleBoard';
import { PieceTray } from '../features/puzzle/components/PieceTray';
import { DragOverlayPiece, DRAG_FINGER_OFFSET_Y } from '../features/puzzle/components/DragOverlayPiece';
import { GameHeader } from '../features/puzzle/components/GameHeader';
import { GameSuccessModal } from '../features/puzzle/components/GameSuccessModal';
import { ImagePreviewModal } from '../features/puzzle/components/ImagePreviewModal';
import { hapticService } from '../services/feedback/hapticService';
import { CompletedPuzzleItem } from '../core/types/collection.types';
import { COLORS } from '../core/theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 24, SCREEN_HEIGHT * 0.45, 380);
// Tahta yatayda tam ortalandığı için mutlak sol X konumu kesindir
const BOARD_PAGE_X = (SCREEN_WIDTH - BOARD_SIZE) / 2;

interface GameScreenProps {
  initialState?: PuzzleGameState | null;
  newGameParams?: {
    imageUri: string;
    gridSize: DifficultyLevel;
  };
  onGoHome: () => void;
  onGoCollection: () => void;
  onOpenSettings: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  initialState,
  newGameParams,
  onGoHome,
  onGoCollection,
  onOpenSettings,
}) => {
  const [completedItem, setCompletedItem] = useState<CompletedPuzzleItem | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  // Sürüklenen Parça
  const [draggingPiece, setDraggingPiece] = useState<PuzzlePieceModel | null>(null);

  // PERFORMANS: React State yerine doğrudan Animated.ValueXY (Sıfır re-render, 120 FPS!)
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Tahtanın ekrandaki dikey konumu
  const boardRef = useRef<any>(null);
  const boardPageYRef = useRef<number>(140);

  const {
    gameState,
    selectedPieceId,
    activeHintPieceId,
    hintTooltip,
    selectPiece,
    placePiece,
    handlePieceDrop,
    handleWrongSlotPress,
    useHint,
  } = usePuzzleGame({
    initialState,
    newGameParams: newGameParams
      ? {
          imageUri: newGameParams.imageUri,
          boardWidth: BOARD_SIZE,
          boardHeight: BOARD_SIZE,
          gridSize: newGameParams.gridSize,
        }
      : undefined,
    onGameCompleted: (item) => {
      setCompletedItem(item);
    },
  });

  const measureBoard = useCallback(() => {
    boardRef.current?.measureInWindow?.((_x: number, y: number) => {
      if (y !== undefined && y > 0) {
        boardPageYRef.current = y;
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(measureBoard, 200);
    return () => clearTimeout(timer);
  }, [measureBoard]);

  if (!gameState) {
    return null;
  }

  // Sürükleme Başladığında (Tek bir kez state güncellenir)
  const handleDragStart = (piece: PuzzlePieceModel, pageX: number, pageY: number) => {
    measureBoard();
    pan.setValue({ x: pageX, y: pageY });
    setDraggingPiece(piece);
  };

  // Sürükleme Devam Ettiğinde: SIFIR RE-RENDER! Sadece donanım seviyesinde pan güncellenir
  const handleDragMove = (pageX: number, pageY: number) => {
    pan.setValue({ x: pageX, y: pageY });
  };

  // Sürükleme Bırakıldığında
  const handleDragEnd = (piece: PuzzlePieceModel, pageX: number, pageY: number) => {
    const boardRelativeX = pageX - BOARD_PAGE_X;
    const boardRelativeY = pageY - DRAG_FINGER_OFFSET_Y - boardPageYRef.current;

    handlePieceDrop(piece, boardRelativeX, boardRelativeY);

    setDraggingPiece(null);
  };

  const handleSlotPress = (targetPiece: PuzzlePieceModel) => {
    if (selectedPieceId === null) return;

    if (selectedPieceId === targetPiece.id) {
      placePiece(targetPiece.id);
    } else {
      handleWrongSlotPress();
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Oyundan Çıkılsın mı?',
      'İlerlemeniz otomatik olarak kaydedildi. Kaldığınız yerden istediğiniz zaman devam edebilirsiniz.',
      [
        { text: 'Devam Et', style: 'cancel' },
        { text: 'Kaydet ve Çık', style: 'default', onPress: onGoHome },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Üst Bar */}
      <GameHeader
        timeElapsed={gameState.timeElapsed}
        moves={gameState.moves}
        hintsRemaining={gameState.hintsRemaining}
        onUseHint={useHint}
        onOpenSettings={onOpenSettings}
        onBack={handleBack}
      />

      {/* 2. Referans Resim Önizleme Çubuğu */}
      <View style={styles.previewRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            hapticService.tapFeedback();
            setIsPreviewVisible(true);
          }}
          style={styles.previewPill}
        >
          <Image source={{ uri: gameState.imageUri }} style={styles.previewThumb} />
          <Text style={styles.previewLabel}>Orijinal Resmi Gör</Text>
          <Eye size={15} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* 3. Yardım Açıklama Balonu */}
      {hintTooltip && (
        <View style={styles.tooltipBanner}>
          <HelpCircle size={15} color="#FBBF24" style={{ marginRight: 6 }} />
          <Text style={styles.tooltipText}>{hintTooltip}</Text>
        </View>
      )}

      {/* 3. Puzzle Tahtası */}
      <View
        ref={boardRef}
        onLayout={measureBoard}
        style={styles.boardContainer}
      >
        <PuzzleBoard
          gameState={gameState}
          activeHintPieceId={activeHintPieceId}
          selectedPieceId={selectedPieceId}
          onSlotPress={handleSlotPress}
        />
      </View>

      {/* 4. Şık Parça Havuzu */}
      <PieceTray
        gameState={gameState}
        selectedPieceId={selectedPieceId}
        draggingPieceId={draggingPiece?.id ?? null}
        onPieceSelect={selectPiece}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />

      {/* 5. 120 FPS Donanım Hızlandırmalı Floating Sürüklenen Parça */}
      {draggingPiece && (
        <DragOverlayPiece
          piece={draggingPiece}
          gameState={gameState}
          pan={pan}
        />
      )}

      {/* 6. Orijinal Resim Önizleme Modalı */}
      <ImagePreviewModal
        visible={isPreviewVisible}
        imageUri={gameState.imageUri}
        onClose={() => setIsPreviewVisible(false)}
      />

      {/* 7. Başarı Modalı */}
      <GameSuccessModal
        visible={!!completedItem}
        item={completedItem}
        onGoHome={onGoHome}
        onGoCollection={onGoCollection}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  previewRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: 8,
  },
  previewThumb: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  previewLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  tooltipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  tooltipText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },
});
