import { BoardState, PieceColor, LastMove } from "./types";
import { getAllLegalMovesForColor } from "./game";
import { keyToPosition, positionToKey } from "./utils";

export type BotDifficulty = "easy" | "medium";

const chooseRandomMove = (
  moves: { from: string; to: string }[]
): { from: string; to: string } => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

const isCaptureMove = (
  move: { from: string; to: string },
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null
): boolean => {
  const movingPiece = board[move.from];
  if (!movingPiece) return false;

  const targetPiece = board[move.to];
  if (targetPiece && targetPiece.color !== botColor) {
    return true;
  }

  if (
    movingPiece.type !== "bonde" ||
    targetPiece ||
    !lastMove ||
    !lastMove.movedTwoSquares
  ) {
    return false;
  }

  const { row: fromRow, col: fromCol } = keyToPosition(move.from);
  const { row: toRow, col: toCol } = keyToPosition(move.to);
  const isDiagonalStep =
    Math.abs(toCol - fromCol) === 1 && Math.abs(toRow - fromRow) === 1;

  if (!isDiagonalStep) return false;

  const capturedPawnKey = positionToKey(fromRow, toCol);
  if (lastMove.to !== capturedPawnKey) return false;

  const capturedPawn = board[capturedPawnKey];
  return (
    !!capturedPawn &&
    capturedPawn.type === "bonde" &&
    capturedPawn.color !== botColor
  );
};

const selectMoveForDifficulty = (
  difficulty: BotDifficulty,
  allMoves: { from: string; to: string }[],
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null
) => {
  switch (difficulty) {
    case "medium": {
      const capturingMoves = allMoves.filter((move) =>
        isCaptureMove(move, board, botColor, lastMove)
      );
      if (capturingMoves.length > 0) {
        return chooseRandomMove(capturingMoves);
      }
      return chooseRandomMove(allMoves);
    }
    case "easy":
    default:
      return chooseRandomMove(allMoves);
  }
};

export const makeBotMove = (
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null,
  difficulty: BotDifficulty = "easy"
): { from: string; to: string } | null => {
  const allMoves = getAllLegalMovesForColor(board, botColor, lastMove);

  if (allMoves.length === 0) return null;

  return selectMoveForDifficulty(difficulty, allMoves, board, botColor, lastMove);
};
