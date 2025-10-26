import { BoardState, PieceColor } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";
import { isSquareUnderAttack } from "../game";

export const calculateKingMoves = (board: BoardState, position: string): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "konge") return [];

  const { row, col } = keyToPosition(position);
  const potentialMoves: string[] = [];
  const opponentColor: PieceColor = piece.color === "white" ? "black" : "white";

  const directions = [
    [-1, -1], [-1, 0], [-1, 1], // up-left, up, up-right
    [0, -1],           [0, 1],  // left, right
    [1, -1],  [1, 0],  [1, 1],  // down-left, down, down-right
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (isValidPosition(newRow, newCol)) {
      const targetKey = positionToKey(newRow, newCol);
      const targetPiece = board[targetKey];

      if (!targetPiece || targetPiece.color !== piece.color) {
        potentialMoves.push(targetKey);
      }
    }
  }

  // Filter out squares that are under attack
  const legalMoves = potentialMoves.filter((move) => {
    const tempBoard = { ...board };
    const movingPiece = { ...piece };

    // Set new position first, then delete old position (consistent with game.ts)
    tempBoard[move] = movingPiece;
    delete tempBoard[position];

    return !isSquareUnderAttack(tempBoard, move, opponentColor);
  });

  return legalMoves;
};