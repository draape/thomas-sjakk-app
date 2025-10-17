import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateRookMoves = (board: BoardState, position: string): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "tårn") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
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