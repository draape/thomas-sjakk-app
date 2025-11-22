import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateSwordMoves = (
  board: BoardState,
  position: string
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "sverd") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Sword moves diagonally like a bishop, but can only jump over allies
  const directions = [
    [-1, -1], // up-left
    [-1, 1],  // up-right
    [1, -1],  // down-left
    [1, 1],   // down-right
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
        break; // cannot move beyond opposing pieces
      }
      // If same color, skip landing but keep scanning (jump over allies)

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return legalMoves;
};
