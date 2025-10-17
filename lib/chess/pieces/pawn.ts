import { BoardState, LastMove, PieceColor } from "../types";
import { keyToPosition, positionToKey, isValidPosition } from "../utils";
import { BOARD_SIZE } from "../constants";

export const calculatePawnMoves = (
  board: BoardState,
  position: string,
  lastMove: LastMove | null = null
): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== "bonde") return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  const direction = piece.color === "white" ? 1 : -1;

  // One square forward
  const oneForward = positionToKey(row - direction, col);
  if (
    row - direction >= 0 &&
    row - direction < BOARD_SIZE &&
    !board[oneForward]
  ) {
    legalMoves.push(oneForward);

    // Two squares forward if hasn't moved yet
    if (!piece.hasMoved) {
      const twoForward = positionToKey(row - direction * 2, col);
      if (
        row - direction * 2 >= 0 &&
        row - direction * 2 < BOARD_SIZE &&
        !board[twoForward]
      ) {
        legalMoves.push(twoForward);
      }
    }
  }

  // Diagonal captures
  const diagonalLeft = positionToKey(row - direction, col - 1);
  const diagonalRight = positionToKey(row - direction, col + 1);

  if (row - direction >= 0 && row - direction < BOARD_SIZE) {
    // Left diagonal
    if (col - 1 >= 0) {
      const targetPiece = board[diagonalLeft];
      if (targetPiece && targetPiece.color !== piece.color) {
        legalMoves.push(diagonalLeft);
      }
    }
    // Right diagonal
    if (col + 1 < BOARD_SIZE) {
      const targetPiece = board[diagonalRight];
      if (targetPiece && targetPiece.color !== piece.color) {
        legalMoves.push(diagonalRight);
      }
    }
  }

  // En passant
  if (lastMove && lastMove.movedTwoSquares) {
    const { row: lastMoveRow, col: lastMoveCol } = keyToPosition(lastMove.to);
    const lastMovePiece = board[lastMove.to];

    if (
      lastMovePiece &&
      lastMovePiece.type === "bonde" &&
      lastMovePiece.color !== piece.color &&
      lastMoveRow === row
    ) {
      // Check left adjacent
      if (lastMoveCol === col - 1) {
        const enPassantSquare = positionToKey(row - direction, col - 1);
        legalMoves.push(enPassantSquare);
      }
      // Check right adjacent
      if (lastMoveCol === col + 1) {
        const enPassantSquare = positionToKey(row - direction, col + 1);
        legalMoves.push(enPassantSquare);
      }
    }
  }

  return legalMoves;
};