import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateBishopMoves = (
  board: BoardState,
  position: string
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "løper") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  const directions = [
    [-1, -1], // up-left
    [-1, 1],  // up-right
    [1, -1],  // down-left
    [1, 1],   // down-right
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    while (isValidPosition(currentRow, currentCol)) {
      const targetKey = positionToKey(currentRow, currentCol);
      const targetPiece = board[targetKey];

      if (!targetPiece) {
        legalMoves.push(targetKey);
      } else if (targetPiece.color !== piece.color) {
        legalMoves.push(targetKey);
        break;
      } else {
        break;
      }

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return legalMoves;
};