import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateRiderMoves = (
  board: BoardState,
  position: string
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "ridder") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Rider moves in all directions (horizontal, vertical, and diagonal), can jump over pieces
  const directions = [
    [-1, -1], [-1, 0], [-1, 1], // up-left, up, up-right
    [0, -1],           [0, 1],  // left, right
    [1, -1],  [1, 0],  [1, 1],  // down-left, down, down-right
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    // Continue in this direction until we hit the board edge
    while (isValidPosition(currentRow, currentCol)) {
      const targetKey = positionToKey(currentRow, currentCol);
      const targetPiece = board[targetKey];

      if (!targetPiece) {
        legalMoves.push(targetKey);
      } else if (targetPiece.color !== piece.color) {
        legalMoves.push(targetKey);
        break; // cannot jump past opposing pieces
      }
      // If same color, skip landing but keep scanning (can jump over allies)

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return legalMoves;
};
