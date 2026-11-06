import { DifficultyLevel, EdgeType, PieceEdges, PuzzlePieceModel } from '../../../core/types/puzzle.types';

/**
 * N x N grid için birbirine kilitlenen kenar tiplerini (TAB / SLOT / FLAT) üretir.
 */
export function generateGridEdges(gridSize: DifficultyLevel): PieceEdges[][] {
  const horizontalEdges: EdgeType[][] = [];
  const verticalEdges: EdgeType[][] = [];

  for (let r = 0; r < gridSize - 1; r++) {
    horizontalEdges[r] = [];
    for (let c = 0; c < gridSize; c++) {
      horizontalEdges[r][c] = Math.random() > 0.5 ? 'TAB' : 'SLOT';
    }
  }

  for (let r = 0; r < gridSize; r++) {
    verticalEdges[r] = [];
    for (let c = 0; c < gridSize - 1; c++) {
      verticalEdges[r][c] = Math.random() > 0.5 ? 'TAB' : 'SLOT';
    }
  }

  const result: PieceEdges[][] = [];

  for (let r = 0; r < gridSize; r++) {
    result[r] = [];
    for (let c = 0; c < gridSize; c++) {
      const top: EdgeType = r === 0 ? 'FLAT' : (horizontalEdges[r - 1][c] === 'TAB' ? 'SLOT' : 'TAB');
      const bottom: EdgeType = r === gridSize - 1 ? 'FLAT' : horizontalEdges[r][c];
      const left: EdgeType = c === 0 ? 'FLAT' : (verticalEdges[r][c - 1] === 'TAB' ? 'SLOT' : 'TAB');
      const right: EdgeType = c === gridSize - 1 ? 'FLAT' : verticalEdges[r][c];

      result[r][c] = { top, right, bottom, left };
    }
  }

  return result;
}

/**
 * Tek bir kenar için puzzle kulakçığı / girintisi SVG Path segmentini üretir.
 */
function getEdgePathSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  edge: EdgeType,
  tabSize: number
): string {
  if (edge === 'FLAT') {
    return `L ${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  const sign = edge === 'TAB' ? -1 : 1;
  const nx = (-dy / len) * sign;
  const ny = (dx / len) * sign;

  const tx = dx / len;
  const ty = dy / len;

  const p1x = x1 + tx * (len * 0.35);
  const p1y = y1 + ty * (len * 0.35);

  const c1x = p1x + tx * (len * 0.03) - nx * (tabSize * 0.2);
  const c1y = p1y + ty * (len * 0.03) - ny * (tabSize * 0.2);

  const c2x = x1 + tx * (len * 0.38) + nx * tabSize;
  const c2y = y1 + ty * (len * 0.38) + ny * tabSize;

  const topX = x1 + tx * (len * 0.5) + nx * (tabSize * 1.15);
  const topY = y1 + ty * (len * 0.5) + ny * (tabSize * 1.15);

  const c3x = x1 + tx * (len * 0.62) + nx * tabSize;
  const c3y = y1 + ty * (len * 0.62) + ny * tabSize;

  const p2x = x1 + tx * (len * 0.65);
  const p2y = y1 + ty * (len * 0.65);

  const c4x = p2x - tx * (len * 0.03) - nx * (tabSize * 0.2);
  const c4y = p2y - ty * (len * 0.03) - ny * (tabSize * 0.2);

  return (
    `L ${p1x.toFixed(2)} ${p1y.toFixed(2)} ` +
    `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${topX.toFixed(2)} ${topY.toFixed(2)} ` +
    `C ${c3x.toFixed(2)} ${c3y.toFixed(2)}, ${c4x.toFixed(2)} ${c4y.toFixed(2)}, ${p2x.toFixed(2)} ${p2y.toFixed(2)} ` +
    `L ${x2.toFixed(2)} ${y2.toFixed(2)} `
  );
}

/**
 * Belirtilen parça için tam kapalı Jigsaw SVG Path d-string'i oluşturur.
 */
export function createPieceSvgPath(
  x: number,
  y: number,
  w: number,
  h: number,
  edges: PieceEdges,
  tabRatio = 0.22
): string {
  const tabSize = Math.min(w, h) * tabRatio;

  const topLeft = { x, y };
  const topRight = { x: x + w, y };
  const bottomRight = { x: x + w, y: y + h };
  const bottomLeft = { x, y: y + h };

  let path = `M ${topLeft.x.toFixed(2)} ${topLeft.y.toFixed(2)} `;
  path += getEdgePathSegment(topLeft.x, topLeft.y, topRight.x, topRight.y, edges.top, tabSize);
  path += getEdgePathSegment(topRight.x, topRight.y, bottomRight.x, bottomRight.y, edges.right, tabSize);
  path += getEdgePathSegment(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, edges.bottom, tabSize);
  path += getEdgePathSegment(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y, edges.left, tabSize);
  path += 'Z';
  return path;
}

/**
 * Fisher-Yates Parça Karıştırma Algoritması
 */
export function shufflePieces<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Parçaları üretir ve havuz için KARIŞTIRARAK (Shuffle) döndürür!
 */
export function initializePieces(
  gridSize: DifficultyLevel,
  boardWidth: number,
  boardHeight: number
): PuzzlePieceModel[] {
  const pieceWidth = boardWidth / gridSize;
  const pieceHeight = boardHeight / gridSize;
  const gridEdges = generateGridEdges(gridSize);

  const pieces: PuzzlePieceModel[] = [];
  let id = 0;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      pieces.push({
        id: id++,
        row: r,
        col: c,
        targetX: c * pieceWidth,
        targetY: r * pieceHeight,
        edges: gridEdges[r][c],
        isPlaced: false,
      });
    }
  }

  // Havuzun karışık gelmesi için Fisher-Yates ile karıştırıyoruz!
  return shufflePieces(pieces);
}
