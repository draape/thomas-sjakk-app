import { BoardState, PieceColor, LastMove } from "./types";
import { getAllLegalMovesForColor } from "./game";

export const makeBotMove = (
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null
): { from: string; to: string } | null => {
  const allMoves = getAllLegalMovesForColor(board, botColor, lastMove);

  if (allMoves.length === 0) return null;

  // Simple random move selection
  const randomIndex = Math.floor(Math.random() * allMoves.length);
  return allMoves[randomIndex];
};