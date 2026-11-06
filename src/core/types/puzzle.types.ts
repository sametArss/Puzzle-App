export type EdgeType = 'FLAT' | 'TAB' | 'SLOT';

export interface PieceEdges {
  top: EdgeType;
  right: EdgeType;
  bottom: EdgeType;
  left: EdgeType;
}

export interface PuzzlePieceModel {
  id: number;
  row: number;
  col: number;
  targetX: number;
  targetY: number;
  edges: PieceEdges;
  isPlaced: boolean;
  placedTimestamp?: number;
}

// 3x3 (9), 4x4 (16), 6x6 (36), 8x8 (64)
export type DifficultyLevel = 3 | 4 | 6 | 8;

export interface PuzzleGameState {
  id: string;
  imageUri: string;
  boardWidth: number;
  boardHeight: number;
  gridSize: DifficultyLevel;
  pieces: PuzzlePieceModel[];
  moves: number;
  timeElapsed: number; // saniye
  hintsRemaining: number; // Kalan ipucu hakkı (varsayılan 3)
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}
