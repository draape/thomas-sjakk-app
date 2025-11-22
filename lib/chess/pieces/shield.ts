import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateShieldMoves = (
  board: BoardState,
  position: string
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "skjold") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Shield moves horizontally and vertically, can jump over pieces
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    // Continue in this direction until we hit the board edge
    while (isValidPosition(currentRow, currentCol)) {
      const targetKey = positionToKey(currentRow, currentCol);
      const targetPiece = board[targetKey];

      // Can move to empty square or capture opponent's piece
      if (!targetPiece) {
        legalMoves.push(targetKey);
      } else if (targetPiece.color !== piece.color) {
        legalMoves.push(targetKey);
        // Can continue jumping over pieces after capturing
      }
      // If same color piece, can't land here but can jump over it

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return legalMoves;
};
