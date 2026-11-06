import { useState, useEffect, useRef, useCallback } from 'react';
import { DifficultyLevel, PuzzleGameState, PuzzlePieceModel } from '../../../core/types/puzzle.types';
import { initializePieces } from '../utils/jigsawPathGenerator';
import { isNearTarget } from '../utils/snapDetector';
import { asyncStorageService } from '../../../services/storage/asyncStorageService';
import { hapticService } from '../../../services/feedback/hapticService';
import { CompletedPuzzleItem } from '../../../core/types/collection.types';

interface UsePuzzleGameProps {
  initialState?: PuzzleGameState | null;
  newGameParams?: {
    imageUri: string;
    boardWidth: number;
    boardHeight: number;
    gridSize: DifficultyLevel;
  };
  onGameCompleted?: (item: CompletedPuzzleItem) => void;
}

export function usePuzzleGame({
  initialState,
  newGameParams,
  onGameCompleted,
}: UsePuzzleGameProps) {
  const [gameState, setGameState] = useState<PuzzleGameState | null>(() => {
    if (initialState) {
      return {
        ...initialState,
        hintsRemaining: initialState.hintsRemaining ?? 3,
      };
    }
    if (newGameParams) {
      const { imageUri, boardWidth, boardHeight, gridSize } = newGameParams;
      return {
        id: `puzzle_${Date.now()}`,
        imageUri,
        boardWidth,
        boardHeight,
        gridSize,
        pieces: initializePieces(gridSize, boardWidth, boardHeight),
        moves: 0,
        timeElapsed: 0,
        hintsRemaining: 3,
        isCompleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    return null;
  });

  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [activeHintPieceId, setActiveHintPieceId] = useState<number | null>(null);
  const [hintTooltip, setHintTooltip] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sayaç mekanizması
  useEffect(() => {
    if (!gameState || gameState.isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.isCompleted) return prev;
        return {
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState?.isCompleted]);

  // Otomatik kaydetme (Auto-Save)
  useEffect(() => {
    if (!gameState) return;
    if (gameState.isCompleted) {
      asyncStorageService.clearActiveGame();
    } else {
      asyncStorageService.saveActiveGame(gameState);
    }
  }, [gameState]);

  // Parça tahtaya oturduğunda çalışır
  const placePiece = useCallback(
    (pieceId: number) => {
      setGameState((prev) => {
        if (!prev) return null;

        const updatedPieces = prev.pieces.map((p) =>
          p.id === pieceId ? { ...p, isPlaced: true, placedTimestamp: Date.now() } : p
        );

        const allPlaced = updatedPieces.every((p) => p.isPlaced);
        const newMoves = prev.moves + 1;

        if (allPlaced) {
          hapticService.successFeedback();
          const completedItem: CompletedPuzzleItem = {
            id: prev.id,
            imageUri: prev.imageUri,
            gridSize: prev.gridSize,
            totalPieces: prev.pieces.length,
            timeElapsed: prev.timeElapsed,
            moves: newMoves,
            completedAt: Date.now(),
          };

          asyncStorageService.saveToCollection(completedItem);
          onGameCompleted?.(completedItem);
        } else {
          hapticService.snapFeedback();
        }

        return {
          ...prev,
          pieces: updatedPieces,
          moves: newMoves,
          isCompleted: allPlaced,
          updatedAt: Date.now(),
        };
      });

      setSelectedPieceId(null);
      setActiveHintPieceId(null);
      setHintTooltip(null);
    },
    [onGameCompleted]
  );

  // Sürükle ve Bırak (Drag & Drop) koordinat kontrolü
  const handlePieceDrop = useCallback(
    (piece: PuzzlePieceModel, dropX: number, dropY: number) => {
      if (!gameState || piece.isPlaced) return false;

      const pieceWidth = gameState.boardWidth / gameState.gridSize;
      const pieceHeight = gameState.boardHeight / gameState.gridSize;

      // Akıllı Snap Algoritması: Yuvanın merkezine ve kutusuna göre kontrol
      const isMatch = isNearTarget(
        dropX,
        dropY,
        piece.targetX,
        piece.targetY,
        pieceWidth,
        pieceHeight
      );

      if (isMatch) {
        placePiece(piece.id);
        return true;
      } else {
        // Yanlış yere bırakıldı: HATA TİTREŞİMİ!
        hapticService.errorFeedback();
        setGameState((prev) => (prev ? { ...prev, moves: prev.moves + 1 } : null));
        return false;
      }
    },
    [gameState, placePiece]
  );

  // Yanlış yuvaya tıklandığında hata titreşimi
  const handleWrongSlotPress = useCallback(() => {
    hapticService.errorFeedback();
    setGameState((prev) => (prev ? { ...prev, moves: prev.moves + 1 } : null));
  }, []);

  // Yardım (Hint) Butonuna basıldığında
  const useHint = useCallback(() => {
    if (!gameState || gameState.hintsRemaining <= 0) {
      setHintTooltip('Yardım hakkınız kalmadı!');
      setTimeout(() => setHintTooltip(null), 3000);
      return;
    }

    let targetPieceId = selectedPieceId;

    if (targetPieceId === null) {
      const firstUnplaced = gameState.pieces.find((p) => !p.isPlaced);
      if (!firstUnplaced) return;
      targetPieceId = firstUnplaced.id;
      setSelectedPieceId(targetPieceId);
    }

    hapticService.tapFeedback();

    setGameState((prev) =>
      prev ? { ...prev, hintsRemaining: prev.hintsRemaining - 1 } : null
    );

    setActiveHintPieceId(targetPieceId);
    setHintTooltip(`💡 İpucu: Parçanın yeri parlatıldı! (${gameState.hintsRemaining - 1} hak kaldı)`);

    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setActiveHintPieceId(null);
      setHintTooltip(null);
    }, 4500);
  }, [gameState, selectedPieceId]);

  const selectPiece = useCallback((id: number) => {
    hapticService.tapFeedback();
    setSelectedPieceId((prev) => (prev === id ? null : id));
  }, []);

  const incrementMoves = useCallback(() => {
    setGameState((prev) => (prev ? { ...prev, moves: prev.moves + 1 } : null));
  }, []);

  return {
    gameState,
    selectedPieceId,
    activeHintPieceId,
    hintTooltip,
    selectPiece,
    placePiece,
    handlePieceDrop,
    handleWrongSlotPress,
    useHint,
    incrementMoves,
    placedPiecesCount: gameState?.pieces.filter((p) => p.isPlaced).length ?? 0,
    totalPiecesCount: gameState?.pieces.length ?? 0,
  };
}
