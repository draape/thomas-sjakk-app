import { BoardState, PieceColor, GameStatus, LastMove } from "./types";
import { INITIAL_POSITIONS, BOARD_SIZE } from "./constants";
import { keyToPosition, positionToKey, isValidPosition } from "./utils";
import { calculatePawnMoves } from "./pieces/pawn";
import { calculateRookMoves } from "./pieces/rook";
import { calculateBishopMoves } from "./pieces/bishop";
import { calculateQueenMoves } from "./pieces/queen";
import { calculateKingMoves } from "./pieces/king";
import { calculateKnightMoves } from "./pieces/knight";
import { calculateSwordMoves } from "./pieces/sword";

export const createInitialBoard = (): BoardState => {
  const board: BoardState = {};
  
  // White pawns on row 2
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode("a".charCodeAt(0) + col);
    board[`${colLetter}2`] = { type: "bonde", color: "white", hasMoved: false };
  }
  
  // Black pawns on row 11
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode("a".charCodeAt(0) + col);
    board[`${colLetter}11`] = { type: "bonde", color: "black", hasMoved: false };
  }

  // Kings
  board[INITIAL_POSITIONS.WHITE_KING] = { type: "konge", color: "white", hasMoved: false };
  board[INITIAL_POSITIONS.BLACK_KING] = { type: "konge", color: "black", hasMoved: false };

  // Queens
  board[INITIAL_POSITIONS.WHITE_QUEEN] = { type: "dronning", color: "white", hasMoved: false };
  board[INITIAL_POSITIONS.BLACK_QUEEN] = { type: "dronning", color: "black", hasMoved: false };

  // Rooks
  INITIAL_POSITIONS.WHITE_ROOKS.forEach(pos => {
    board[pos] = { type: "tårn", color: "white", hasMoved: false };
  });
  INITIAL_POSITIONS.BLACK_ROOKS.forEach(pos => {
    board[pos] = { type: "tårn", color: "black", hasMoved: false };
  });

  // Bishops
  INITIAL_POSITIONS.WHITE_BISHOPS.forEach(pos => {
    board[pos] = { type: "løper", color: "white", hasMoved: false };
  });
  INITIAL_POSITIONS.BLACK_BISHOPS.forEach(pos => {
    board[pos] = { type: "løper", color: "black", hasMoved: false };
  });

  // Knights
  INITIAL_POSITIONS.WHITE_KNIGHTS.forEach(pos => {
    board[pos] = { type: "hest", color: "white", hasMoved: false };
  });
  INITIAL_POSITIONS.BLACK_KNIGHTS.forEach(pos => {
    board[pos] = { type: "hest", color: "black", hasMoved: false };
  });

  // Swords
  INITIAL_POSITIONS.WHITE_SWORDS.forEach(pos => {
    board[pos] = { type: "sverd", color: "white", hasMoved: false };
  });
  INITIAL_POSITIONS.BLACK_SWORDS.forEach(pos => {
    board[pos] = { type: "sverd", color: "black", hasMoved: false };
  });

  return board;
};

export const isSquareUnderAttack = (
  board: BoardState,
  position: string,
  byColor: PieceColor
): boolean => {
  const { row, col } = keyToPosition(position);

  // Check for attacking pawns
  const pawnDirection = byColor === "white" ? 1 : -1;
  const pawnAttackPositions = [
    positionToKey(row + pawnDirection, col - 1),
    positionToKey(row + pawnDirection, col + 1),
  ];

  for (const attackPos of pawnAttackPositions) {
    const attacker = board[attackPos];
    if (attacker && attacker.type === "bonde" && attacker.color === byColor) {
      return true;
    }
  }

  // Check for attacking knights
  const knightMoves = [
    [-2, -1], [-2, 1],
    [2, -1],  [2, 1],
    [-1, -2], [-1, 2],
    [1, -2],  [1, 2],
  ];

  for (const [dRow, dCol] of knightMoves) {
    const knightRow = row + dRow;
    const knightCol = col + dCol;
    if (isValidPosition(knightRow, knightCol)) {
      const attackPos = positionToKey(knightRow, knightCol);
      const attacker = board[attackPos];
      if (attacker && attacker.type === "hest" && attacker.color === byColor) {
        return true;
      }
    }
  }

  // Check for attacking swords (can jump over pieces, diagonal only)
  const diagonalDirections = [
    [-1, -1], [-1, 1],
    [1, -1],  [1, 1],
  ];

  for (const [dRow, dCol] of diagonalDirections) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    // Check all squares in this diagonal direction
    while (isValidPosition(currentRow, currentCol)) {
      const attackPos = positionToKey(currentRow, currentCol);
      const attacker = board[attackPos];

      if (attacker && attacker.type === "sverd" && attacker.color === byColor) {
        return true;
      }

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  // Check for attacking pieces using their movement patterns
  const allDirections = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  // Check for king attacks (adjacent squares)
  for (const [dRow, dCol] of allDirections) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    if (isValidPosition(newRow, newCol)) {
      const attackPos = positionToKey(newRow, newCol);
      const attacker = board[attackPos];
      if (attacker && attacker.type === "konge" && attacker.color === byColor) {
        return true;
      }
    }
  }

  // Check for sliding piece attacks
  for (const [dRow, dCol] of allDirections) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    while (isValidPosition(currentRow, currentCol)) {
      const attackPos = positionToKey(currentRow, currentCol);
      const attacker = board[attackPos];

      if (attacker) {
        if (attacker.color === byColor) {
          // Check if this piece can attack in this direction
          const isDiagonal = Math.abs(dRow) === Math.abs(dCol);
          const isOrthogonal = dRow === 0 || dCol === 0;
          
          if (attacker.type === "dronning" || 
              (attacker.type === "løper" && isDiagonal) ||
              (attacker.type === "tårn" && isOrthogonal)) {
            return true;
          }
        }
        break;
      }

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return false;
};

export const findKing = (board: BoardState, color: PieceColor): string | null => {
  for (const [position, piece] of Object.entries(board)) {
    if (piece.type === "konge" && piece.color === color) {
      return position;
    }
  }
  return null;
};

export const isKingInCheck = (board: BoardState, color: PieceColor): boolean => {
  const kingPosition = findKing(board, color);
  if (!kingPosition) return false;

  const opponentColor: PieceColor = color === "white" ? "black" : "white";
  return isSquareUnderAttack(board, kingPosition, opponentColor);
};

export const calculateLegalMoves = (
  board: BoardState,
  position: string,
  lastMove: LastMove | null = null
): string[] => {
  const piece = board[position];
  if (!piece) return [];

  let potentialMoves: string[] = [];

  switch (piece.type) {
    case "konge":
      return calculateKingMoves(board, position);
    case "bonde":
      potentialMoves = calculatePawnMoves(board, position, lastMove);
      break;
    case "dronning":
      potentialMoves = calculateQueenMoves(board, position);
      break;
    case "tårn":
      potentialMoves = calculateRookMoves(board, position);
      break;
    case "løper":
      potentialMoves = calculateBishopMoves(board, position);
      break;
    case "hest":
      potentialMoves = calculateKnightMoves(board, position);
      break;
    case "sverd":
      potentialMoves = calculateSwordMoves(board, position);
      break;
    default:
      return [];
  }

  // Filter out moves that would leave our king in check
  const legalMoves = potentialMoves.filter((move) => {
    const tempBoard = { ...board };
    const movingPiece = tempBoard[position];

    // Handle en passant capture
    if (movingPiece.type === "bonde" && lastMove) {
      const { row: sourceRow, col: sourceCol } = keyToPosition(position);
      const { col: destCol } = keyToPosition(move);

      if (Math.abs(destCol - sourceCol) === 1 && !tempBoard[move]) {
        const capturedPawnKey = positionToKey(sourceRow, destCol);
        delete tempBoard[capturedPawnKey];
      }
    }

    tempBoard[move] = movingPiece;
    delete tempBoard[position];

    return !isKingInCheck(tempBoard, piece.color);
  });

  return legalMoves;
};

export const getAllLegalMovesForColor = (
  board: BoardState,
  color: PieceColor,
  lastMove: LastMove | null
): { from: string; to: string }[] => {
  const allMoves: { from: string; to: string }[] = [];

  for (const [position, piece] of Object.entries(board)) {
    if (piece.color === color) {
      const moves = calculateLegalMoves(board, position, lastMove);
      for (const move of moves) {
        allMoves.push({ from: position, to: move });
      }
    }
  }

  return allMoves;
};

export const checkGameStatus = (
  board: BoardState,
  currentPlayerColor: PieceColor,
  lastMove: LastMove | null
): GameStatus => {
  const allMoves = getAllLegalMovesForColor(board, currentPlayerColor, lastMove);

  if (allMoves.length > 0) {
    return "ongoing";
  }

  const kingInCheck = isKingInCheck(board, currentPlayerColor);
  return kingInCheck ? "checkmate" : "stalemate";
};