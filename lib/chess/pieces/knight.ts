import { BoardState } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";

export const calculateKnightMoves = (
  board: BoardState,
  position: string
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "hest") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Knight moves in L-shape: 2 squares in one direction, 1 square perpendicular
  // "to fram og en til siden" - kan hoppe til alle 8 mulige posisjoner
  const knightMoves = [
    [-2, -1], [-2, 1],  // 2 up, 1 left/right
    [2, -1],  [2, 1],   // 2 down, 1 left/right
    [-1, -2], [-1, 2],  // 1 up, 2 left/right
    [1, -2],  [1, 2],   // 1 down, 2 left/right
  ];

  for (const [dRow, dCol] of knightMoves) {
    const targetRow = row + dRow;
    const targetCol = col + dCol;

    if (isValidPosition(targetRow, targetCol)) {
      const targetKey = positionToKey(targetRow, targetCol);
      const targetPiece = board[targetKey];

      // Can move to empty square or capture opponent's piece
      if (!targetPiece || targetPiece.color !== piece.color) {
        legalMoves.push(targetKey);
      }
    }
  }

  return legalMoves;
};
