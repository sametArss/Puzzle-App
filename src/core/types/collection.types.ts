import { DifficultyLevel } from './puzzle.types';

export interface CompletedPuzzleItem {
  id: string;
  imageUri: string;
  gridSize: DifficultyLevel;
  totalPieces: number;
  timeElapsed: number; // saniye cinsinden
  moves: number;
  completedAt: number; // timestamp
}

