import { BoardState, PieceColor, LastMove, Piece, PieceType } from "./types";
import { calculateLegalMoves, getAllLegalMovesForColor } from "./game";
import { BOARD_SIZE } from "./constants";
import { keyToPosition, positionToKey } from "./utils";

export type BotDifficulty = "easy" | "medium" | "hard" | "pro";

const PIECE_VALUES: Record<PieceType, number> = {
  bonde: 1,
  hest: 3,
  løper: 3,
  tårn: 5,
  sverd: 6,
  skjold: 9,
  dronning: 9,
  ridder: 13,
  konge: 100,
};

const getPieceValue = (piece?: Piece): number => {
  if (!piece) return 0;
  return PIECE_VALUES[piece.type] ?? 0;
};

const chooseRandomMove = (
  moves: { from: string; to: string }[]
): { from: string; to: string } => {
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

const getCaptureValue = (
  move: { from: string; to: string },
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null
): number => {
  const movingPiece = board[move.from];
  if (!movingPiece) return 0;

  const targetPiece = board[move.to];
  if (targetPiece && targetPiece.color !== botColor) {
    return getPieceValue(targetPiece);
  }

  if (
    movingPiece.type !== "bonde" ||
    targetPiece ||
    !lastMove ||
    !lastMove.movedTwoSquares
  ) {
    return 0;
  }

  const { row: fromRow, col: fromCol } = keyToPosition(move.from);
  const { row: toRow, col: toCol } = keyToPosition(move.to);
  const isDiagonalStep =
    Math.abs(toCol - fromCol) === 1 && Math.abs(toRow - fromRow) === 1;

  if (!isDiagonalStep) return 0;

  const capturedPawnKey = positionToKey(fromRow, toCol);
  if (lastMove.to !== capturedPawnKey) return 0;

  const capturedPawn = board[capturedPawnKey];
  if (
    capturedPawn &&
    capturedPawn.type === "bonde" &&
    capturedPawn.color !== botColor
  ) {
    return getPieceValue(capturedPawn);
  }

  return 0;
};

const simulateMove = (
  board: BoardState,
  move: { from: string; to: string }
): BoardState | null => {
  const movingPiece = board[move.from];
  if (!movingPiece) return null;

  const newBoard: BoardState = { ...board };
  const { row: fromRow, col: fromCol } = keyToPosition(move.from);
  const { row: toRow, col: toCol } = keyToPosition(move.to);
  const targetPiece = board[move.to];

  if (
    movingPiece.type === "bonde" &&
    Math.abs(toCol - fromCol) === 1 &&
    !targetPiece
  ) {
    const capturedPawnKey = positionToKey(fromRow, toCol);
    delete newBoard[capturedPawnKey];
  }

  let finalPiece = { ...movingPiece, hasMoved: true };
  if (movingPiece.type === "bonde") {
    const gameRow = BOARD_SIZE - toRow;
    if (
      (movingPiece.color === "white" && gameRow === BOARD_SIZE) ||
      (movingPiece.color === "black" && gameRow === 1)
    ) {
      finalPiece = { ...finalPiece, type: "dronning" };
    }
  }

  newBoard[move.to] = finalPiece;
  delete newBoard[move.from];

  return newBoard;
};

const getThreatValue = (
  move: { from: string; to: string },
  board: BoardState,
  botColor: PieceColor
): number => {
  const simulatedBoard = simulateMove(board, move);
  if (!simulatedBoard) return 0;

  const movesFromDestination = calculateLegalMoves(
    simulatedBoard,
    move.to,
    null
  );

  let maxValue = 0;
  for (const target of movesFromDestination) {
    const piece = simulatedBoard[target];
    if (piece && piece.color !== botColor) {
      const value = getPieceValue(piece);
      if (value > maxValue) {
        maxValue = value;
      }
    }
  }
  return maxValue;
};

type EvaluatedMove = { move: { from: string; to: string }; value: number };

const evaluateMoves = (
  moves: { from: string; to: string }[],
  evaluator: (move: { from: string; to: string }) => number
): EvaluatedMove[] => {
  return moves
    .map((move) => ({ move, value: evaluator(move) }))
    .filter((entry) => entry.value > 0);
};

const chooseBestValuedMove = (
  evaluatedMoves: EvaluatedMove[]
): { from: string; to: string } | null => {
  if (evaluatedMoves.length === 0) return null;

  let bestValue = 0;
  const bestMoves: { from: string; to: string }[] = [];

  for (const entry of evaluatedMoves) {
    if (entry.value > bestValue) {
      bestValue = entry.value;
      bestMoves.length = 0;
      bestMoves.push(entry.move);
    } else if (entry.value === bestValue) {
      bestMoves.push(entry.move);
    }
  }

  return chooseRandomMove(bestMoves);
};

const selectMoveForDifficulty = (
  difficulty: BotDifficulty,
  allMoves: { from: string; to: string }[],
  board: BoardState,
  botColor: PieceColor,
  lastMove: LastMove | null
) => {
  switch (difficulty) {
    case "pro": {
      const capturingMoves = evaluateMoves(allMoves, (move) =>
        getCaptureValue(move, board, botColor, lastMove)
      );
      const bestCapture = chooseBestValuedMove(capturingMoves);
      if (bestCapture) return bestCapture;

      const threateningMoves = evaluateMoves(allMoves, (move) =>
        getThreatValue(move, board, botColor)
      );
      const bestThreat = chooseBestValuedMove(threateningMoves);
      if (bestThreat) return bestThreat;

      return chooseRandomMove(allMoves);
    }
    case "hard": {
      const capturingMoves = allMoves.filter(
        (move) => getCaptureValue(move, board, botColor, lastMove) > 0
      );
      if (capturingMoves.length > 0) {
        return chooseRandomMove(capturingMoves);
      }
      const threateningMoves = allMoves.filter(
        (move) => getThreatValue(move, board, botColor) > 0
      );
      if (threateningMoves.length > 0) {
        return chooseRandomMove(threateningMoves);
      }
      return chooseRandomMove(allMoves);
    }
    case "medium": {
      const capturingMoves = allMoves.filter(
        (move) => getCaptureValue(move, board, botColor, lastMove) > 0
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
