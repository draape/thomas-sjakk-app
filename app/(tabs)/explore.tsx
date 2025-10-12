import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { GameOverModal } from '@/components/game-over-modal';

const BOARD_SIZE = 12;
const LIGHT_COLOR = '#ebebd0';
const DARK_COLOR = '#7f9459';

// Piece types
type PieceColor = 'white' | 'black';
type PieceType = 'bonde' | 'dronning' | 'konge';

interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

interface BoardState {
  [key: string]: Piece;
}

interface Position {
  row: number;
  col: number;
}

// Import SVG components
const WhiteBonde = require('@/assets/svg/white/bonde.svg');
const BlackBonde = require('@/assets/svg/black/bonde.svg');
const WhiteDronning = require('@/assets/svg/white/dronning.svg');
const BlackDronning = require('@/assets/svg/black/dronning.svg');
const WhiteKonge = require('@/assets/svg/white/konge.svg');
const BlackKonge = require('@/assets/svg/black/konge.svg');

// Initial board setup - using 1-indexed rows (1 = bottom, 12 = top)
// White pieces start on rows 1 and 2 (bottom)
// Black pieces start on rows 12 and 11 (top)
const createInitialBoard = (): BoardState => {
  const board: BoardState = {};
  // White pawns on row 2 (bottom)
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
    board[`${colLetter}2`] = { type: 'bonde', color: 'white', hasMoved: false };
  }
  // Black pawns on row 11 (top)
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
    board[`${colLetter}11`] = { type: 'bonde', color: 'black', hasMoved: false };
  }

  // Kings - white king at g1, black king at g12
  board['g1'] = { type: 'konge', color: 'white', hasMoved: false };
  board['g12'] = { type: 'konge', color: 'black', hasMoved: false };

  // Queens - white queen at f1, black queen at f12
  board['f1'] = { type: 'dronning', color: 'white', hasMoved: false };
  board['f12'] = { type: 'dronning', color: 'black', hasMoved: false };

  return board;
};

// Helper functions
const positionToKey = (row: number, col: number): string => {
  const gameRow = BOARD_SIZE - row;
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
  return `${colLetter}${gameRow}`;
};

const keyToPosition = (key: string): Position => {
  const col = key.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = BOARD_SIZE - parseInt(key.slice(1));
  return { row, col };
};

// Get SVG component for piece
const getPieceSvg = (piece: Piece) => {
  if (piece.type === 'bonde') {
    return piece.color === 'white' ? WhiteBonde : BlackBonde;
  }
  if (piece.type === 'dronning') {
    return piece.color === 'white' ? WhiteDronning : BlackDronning;
  }
  if (piece.type === 'konge') {
    return piece.color === 'white' ? WhiteKonge : BlackKonge;
  }
  return null;
};

// Check if a square is under attack by opponent
const isSquareUnderAttack = (board: BoardState, position: string, byColor: PieceColor): boolean => {
  const { row, col } = keyToPosition(position);

  // Check for attacking pawns
  const pawnDirection = byColor === 'white' ? 1 : -1; // Opposite of pawn's forward direction
  const pawnAttackPositions = [
    positionToKey(row + pawnDirection, col - 1),
    positionToKey(row + pawnDirection, col + 1),
  ];

  for (const attackPos of pawnAttackPositions) {
    const attacker = board[attackPos];
    if (attacker && attacker.type === 'bonde' && attacker.color === byColor) {
      return true;
    }
  }

  // Check for attacking king (king can't move next to another king)
  const kingDirections = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [dRow, dCol] of kingDirections) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      const attackPos = positionToKey(newRow, newCol);
      const attacker = board[attackPos];
      if (attacker && attacker.type === 'konge' && attacker.color === byColor) {
        return true;
      }
    }
  }

  // Check for attacking queen (can attack from any direction along lines)
  const queenDirections = [
    [-1, -1], [-1, 0], [-1, 1],  // up-left, up, up-right
    [0, -1],           [0, 1],   // left, right
    [1, -1],  [1, 0],  [1, 1],   // down-left, down, down-right
  ];

  for (const [dRow, dCol] of queenDirections) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    // Check along this direction until we hit something
    while (currentRow >= 0 && currentRow < BOARD_SIZE &&
           currentCol >= 0 && currentCol < BOARD_SIZE) {
      const attackPos = positionToKey(currentRow, currentCol);
      const attacker = board[attackPos];

      if (attacker) {
        // Found a piece - check if it's an attacking queen
        if (attacker.type === 'dronning' && attacker.color === byColor) {
          return true;
        }
        // Hit a piece, can't attack through it
        break;
      }

      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return false;
};

// Find the king of a given color on the board
const findKing = (board: BoardState, color: PieceColor): string | null => {
  for (const [position, piece] of Object.entries(board)) {
    if (piece.type === 'konge' && piece.color === color) {
      return position;
    }
  }
  return null;
};

// Check if a king is under attack (in check)
const isKingInCheck = (board: BoardState, color: PieceColor): boolean => {
  const kingPosition = findKing(board, color);
  if (!kingPosition) return false;

  const opponentColor: PieceColor = color === 'white' ? 'black' : 'white';
  return isSquareUnderAttack(board, kingPosition, opponentColor);
};

// Check game status: 'ongoing', 'checkmate', or 'stalemate'
type GameStatus = 'ongoing' | 'checkmate' | 'stalemate';

const checkGameStatus = (board: BoardState, currentPlayerColor: PieceColor, lastMove: { from: string; to: string; movedTwoSquares: boolean } | null): GameStatus => {
  // Check if the current player has any legal moves
  const allMoves: { from: string; to: string }[] = [];

  for (const [position, piece] of Object.entries(board)) {
    if (piece.color === currentPlayerColor) {
      const moves = calculateLegalMoves(board, position, lastMove);
      for (const move of moves) {
        allMoves.push({ from: position, to: move });
      }
    }
  }

  // If there are legal moves, game is ongoing
  if (allMoves.length > 0) {
    return 'ongoing';
  }

  // No legal moves - check if king is in check
  const kingInCheck = isKingInCheck(board, currentPlayerColor);

  if (kingInCheck) {
    // King is in check and has no legal moves = checkmate
    return 'checkmate';
  } else {
    // King is not in check but has no legal moves = stalemate
    return 'stalemate';
  }
};

// Calculate legal moves for a queen
const calculateQueenMoves = (board: BoardState, position: string): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== 'dronning') return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Queen can move in 8 directions: horizontal, vertical, and diagonal
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // up-left, up, up-right
    [0, -1],           [0, 1],   // left, right
    [1, -1],  [1, 0],  [1, 1],   // down-left, down, down-right
  ];

  for (const [dRow, dCol] of directions) {
    let currentRow = row + dRow;
    let currentCol = col + dCol;

    // Keep moving in this direction until we hit the edge or another piece
    while (currentRow >= 0 && currentRow < BOARD_SIZE &&
           currentCol >= 0 && currentCol < BOARD_SIZE) {
      const targetKey = positionToKey(currentRow, currentCol);
      const targetPiece = board[targetKey];

      if (!targetPiece) {
        // Empty square - can move here
        legalMoves.push(targetKey);
      } else if (targetPiece.color !== piece.color) {
        // Opponent's piece - can capture it, but can't move further
        legalMoves.push(targetKey);
        break;
      } else {
        // Own piece - can't move here or further
        break;
      }

      // Move to next square in this direction
      currentRow += dRow;
      currentCol += dCol;
    }
  }

  return legalMoves;
};

// Calculate legal moves for a king
const calculateKingMoves = (board: BoardState, position: string): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== 'konge') return [];

  const { row, col } = keyToPosition(position);
  const potentialMoves: string[] = [];
  const opponentColor: PieceColor = piece.color === 'white' ? 'black' : 'white';

  // King can move one square in all directions (8 possible moves)
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],  // up-left, up, up-right
    [0, -1],           [0, 1],   // left, right
    [1, -1],  [1, 0],  [1, 1],   // down-left, down, down-right
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    // Check if the new position is within bounds
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      const targetKey = positionToKey(newRow, newCol);
      const targetPiece = board[targetKey];

      // Can move to empty square or capture opponent's piece
      if (!targetPiece || targetPiece.color !== piece.color) {
        potentialMoves.push(targetKey);
      }
    }
  }

  // Filter out squares that are under attack
  const legalMoves = potentialMoves.filter(move => {
    // Create a temporary board with the king moved
    const tempBoard = { ...board };
    delete tempBoard[position];
    if (board[move]) {
      // If capturing, remove the captured piece
      delete tempBoard[move];
    }
    tempBoard[move] = piece;

    // Check if the king would be under attack at the new position
    return !isSquareUnderAttack(tempBoard, move, opponentColor);
  });

  return legalMoves;
};

// Calculate legal moves for a pawn
const calculatePawnMoves = (board: BoardState, position: string, lastMove: { from: string; to: string; movedTwoSquares: boolean } | null = null): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== 'bonde') return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Pawns move forward based on color
  // White (bottom) moves up toward black (decreasing row in display)
  // Black (top) moves down toward white (increasing row in display)
  const direction = piece.color === 'white' ? 1 : -1;

  // One square forward
  const oneForward = positionToKey(row - direction, col);
  if (row - direction >= 0 && row - direction < BOARD_SIZE && !board[oneForward]) {
    legalMoves.push(oneForward);

    // Two squares forward if hasn't moved yet
    if (!piece.hasMoved) {
      const twoForward = positionToKey(row - direction * 2, col);
      if (row - direction * 2 >= 0 && row - direction * 2 < BOARD_SIZE && !board[twoForward]) {
        legalMoves.push(twoForward);
      }
    }
  }

  // Diagonal captures (one square forward and to the side)
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

    // Check if the pawn that just moved two squares is adjacent to this pawn
    if (lastMovePiece && lastMovePiece.type === 'bonde' &&
        lastMovePiece.color !== piece.color && lastMoveRow === row) {
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

// Calculate legal moves for any piece, filtering out moves that would leave king in check
const calculateLegalMoves = (board: BoardState, position: string, lastMove: { from: string; to: string; movedTwoSquares: boolean } | null = null): string[] => {
  const piece = board[position];
  if (!piece) return [];

  let potentialMoves: string[] = [];

  switch (piece.type) {
    case 'konge':
      return calculateKingMoves(board, position); // King moves already filter out attacked squares
    case 'bonde':
      potentialMoves = calculatePawnMoves(board, position, lastMove);
      break;
    case 'dronning':
      potentialMoves = calculateQueenMoves(board, position);
      break;
    default:
      return [];
  }

  // For non-king pieces, filter out moves that would leave our king in check
  const legalMoves = potentialMoves.filter(move => {
    // Simulate the move
    const tempBoard = { ...board };
    const movingPiece = tempBoard[position];

    // Handle en passant capture
    if (movingPiece.type === 'bonde' && lastMove) {
      const { row: sourceRow, col: sourceCol } = keyToPosition(position);
      const { col: destCol } = keyToPosition(move);

      // If moving diagonally to an empty square, it's en passant
      if (Math.abs(destCol - sourceCol) === 1 && !tempBoard[move]) {
        const capturedPawnKey = positionToKey(sourceRow, destCol);
        delete tempBoard[capturedPawnKey];
      }
    }

    // Execute the move on temp board
    tempBoard[move] = movingPiece;
    delete tempBoard[position];

    // Check if our king would be in check after this move
    return !isKingInCheck(tempBoard, piece.color);
  });

  return legalMoves;
};

// Player info
// Player (Thomas) is always at the bottom, opponent (bot) at the top
// White pieces are at the bottom, black pieces at the top
const player = {
  name: 'Thomas',
  rating: 1450,
  color: 'Hvit',  // Player plays white (bottom)
  avatar: require('@/assets/images/thomas.jpg'),
};

const opponent = {
  name: 'EasyBot 1000',
  rating: 1200,
  color: 'Svart',  // Bot plays black (top)
  avatar: require('@/assets/images/easybot.jpg'),
};

export default function ChessBoardScreen() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [attackedSquares, setAttackedSquares] = useState<string[]>([]); // Squares under attack (for king)
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white'); // White (EasyBot) starts
  const [lastMove, setLastMove] = useState<{ from: string; to: string; movedTwoSquares: boolean } | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ongoing');

  // Get all legal moves for a color
  const getAllLegalMovesForColor = (board: BoardState, color: PieceColor, lastMove: { from: string; to: string; movedTwoSquares: boolean } | null): { from: string; to: string }[] => {
    const allMoves: { from: string; to: string }[] = [];

    // Go through all squares
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

  // EasyBot makes a random move
  const makeBotMove = () => {
    const botColor: PieceColor = 'black'; // Bot plays black
    const allMoves = getAllLegalMovesForColor(board, botColor, lastMove);

    if (allMoves.length === 0) return; // No legal moves

    // Pick a random move
    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];

    // Execute the move
    const newBoard = { ...board };
    const movingPiece = newBoard[randomMove.from];
    const { row: sourceRow, col: sourceCol } = keyToPosition(randomMove.from);
    const { row: destRow, col: destCol } = keyToPosition(randomMove.to);

    // Check if this is a two-square pawn move
    const movedTwoSquares = movingPiece.type === 'bonde' && Math.abs(destRow - sourceRow) === 2;

    // Check for en passant capture
    if (movingPiece.type === 'bonde' && Math.abs(destCol - sourceCol) === 1 && !board[randomMove.to]) {
      const capturedPawnKey = positionToKey(sourceRow, destCol);
      delete newBoard[capturedPawnKey];
    }

    // Check for pawn promotion
    let finalPiece = { ...movingPiece, hasMoved: true };
    if (movingPiece.type === 'bonde') {
      const gameRow = BOARD_SIZE - destRow;
      if ((movingPiece.color === 'white' && gameRow === 12) ||
          (movingPiece.color === 'black' && gameRow === 1)) {
        finalPiece = { ...finalPiece, type: 'dronning' };
      }
    }

    // Move the piece
    newBoard[randomMove.to] = finalPiece;
    delete newBoard[randomMove.from];

    setBoard(newBoard);
    const newLastMove = { from: randomMove.from, to: randomMove.to, movedTwoSquares };
    setLastMove(newLastMove);

    // Check if the game is over after bot's move
    const status = checkGameStatus(newBoard, 'white', newLastMove);
    setGameStatus(status);

    // Always switch to next player's turn (even if game is over, for result calculation)
    setCurrentPlayer('white');
  };

  // Trigger bot move when it's bot's turn
  useEffect(() => {
    if (currentPlayer === 'black') {
      // Add a small delay so the move isn't instant
      const timeout = setTimeout(() => {
        makeBotMove();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, board]);

  const handleNewGame = () => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setLegalMoves([]);
    setAttackedSquares([]);
    setCurrentPlayer('white');
    setLastMove(null);
    setGameStatus('ongoing');
  };

  const handleSquarePress = (row: number, col: number) => {
    const key = positionToKey(row, col);
    const piece = board[key];

    // If clicking on a legal move, move the piece
    if (selectedSquare && legalMoves.includes(key)) {
      const newBoard = { ...board };
      const movingPiece = newBoard[selectedSquare];
      const { row: sourceRow, col: sourceCol } = keyToPosition(selectedSquare);
      const { row: destRow, col: destCol } = keyToPosition(key);

      // Check if this is a two-square pawn move
      const movedTwoSquares = movingPiece.type === 'bonde' && Math.abs(destRow - sourceRow) === 2;

      // Check for en passant capture
      let isEnPassant = false;
      if (movingPiece.type === 'bonde' && Math.abs(destCol - sourceCol) === 1 && !board[key]) {
        // Moving diagonally to an empty square means en passant
        isEnPassant = true;
        // Remove the captured pawn (it's on the same row as the source, but in the destination column)
        const capturedPawnKey = positionToKey(sourceRow, destCol);
        delete newBoard[capturedPawnKey];
      }

      // Check for pawn promotion
      let finalPiece = { ...movingPiece, hasMoved: true };
      if (movingPiece.type === 'bonde') {
        // White pawn reaches row 11 (top, row 12 in game coordinates) - opponent's first rank
        // Black pawn reaches row 0 (bottom, row 1 in game coordinates) - opponent's first rank
        const gameRow = BOARD_SIZE - destRow;
        if ((movingPiece.color === 'white' && gameRow === 12) ||
            (movingPiece.color === 'black' && gameRow === 1)) {
          finalPiece = { ...finalPiece, type: 'dronning' };
        }
      }

      // Move the piece
      newBoard[key] = finalPiece;
      delete newBoard[selectedSquare];

      setBoard(newBoard);
      setSelectedSquare(null);
      setLegalMoves([]);
      setAttackedSquares([]);
      const newLastMove = { from: selectedSquare, to: key, movedTwoSquares };
      setLastMove(newLastMove);

      // Check if the game is over after this move
      const status = checkGameStatus(newBoard, 'black', newLastMove);
      setGameStatus(status);

      // Always switch to next player's turn (even if game is over, for result calculation)
      setCurrentPlayer('black');
    }
    // If clicking on own piece, select it
    else if (piece && piece.color === currentPlayer) {
      setSelectedSquare(key);
      const moves = calculateLegalMoves(board, key, lastMove);
      setLegalMoves(moves);

      // If it's a king, also calculate which squares are under attack
      if (piece.type === 'konge') {
        const opponentColor: PieceColor = piece.color === 'white' ? 'black' : 'white';
        const { row, col } = keyToPosition(key);
        const attacked: string[] = [];

        // Check all potential king moves
        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1],
        ];

        for (const [dRow, dCol] of directions) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            const targetKey = positionToKey(newRow, newCol);
            const targetPiece = board[targetKey];

            // Square is accessible (empty or has opponent piece) but is under attack
            if ((!targetPiece || targetPiece.color !== piece.color) && !moves.includes(targetKey)) {
              attacked.push(targetKey);
            }
          }
        }
        setAttackedSquares(attacked);
      } else {
        setAttackedSquares([]);
      }
    }
    // If clicking elsewhere, deselect
    else {
      setSelectedSquare(null);
      setLegalMoves([]);
      setAttackedSquares([]);
    }
  };

  const renderPlayerInfo = (playerData: typeof opponent, isTop: boolean) => {
    return (
      <View style={styles.playerInfo}>
        <View style={styles.avatar}>
          <Image
            source={playerData.avatar}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.playerDetails}>
          <ThemedText style={styles.playerName}>{playerData.name}</ThemedText>
          <ThemedText style={styles.playerRating}>Rating: {playerData.rating}</ThemedText>
        </View>
        <View style={styles.colorIndicator}>
          <View style={[
            styles.colorCircle,
            { backgroundColor: playerData.color === 'Hvit' ? '#fff' : '#000' }
          ]} />
          <ThemedText style={styles.colorText}>{playerData.color}</ThemedText>
        </View>
      </View>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const squares = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isLight = (row + col) % 2 === 0;
        const key = positionToKey(row, col);
        const piece = board[key];
        const PieceSvg = piece ? getPieceSvg(piece) : null;
        const isSelected = selectedSquare === key;
        const isLegalMove = legalMoves.includes(key);
        const isUnderAttack = attackedSquares.includes(key);

        squares.push(
          <TouchableOpacity
            key={`${row}-${col}`}
            style={[
              styles.square,
              { backgroundColor: isLight ? LIGHT_COLOR : DARK_COLOR },
              isSelected && styles.selectedSquare,
            ]}
            onPress={() => handleSquarePress(row, col)}
          >
            {PieceSvg && (
              <Image source={PieceSvg} style={styles.pieceImage} />
            )}
            {isLegalMove && (
              <View style={styles.legalMoveDot} />
            )}
            {isUnderAttack && (
              <View style={styles.attackedSquareCross}>
                <View style={styles.crossLine1} />
                <View style={styles.crossLine2} />
              </View>
            )}
          </TouchableOpacity>
        );
      }
      rows.push(
        <View key={row} style={styles.row}>
          {squares}
        </View>
      );
    }
    return rows;
  };

  // Determine game result from player's perspective
  const getGameResult = (): 'win' | 'loss' | 'draw' | null => {
    if (gameStatus === 'ongoing') return null;
    if (gameStatus === 'stalemate') return 'draw';

    // Checkmate - determine winner based on who has no legal moves
    // currentPlayer is the one whose turn it is (and who has no moves)
    // Player is white, bot is black
    if (currentPlayer === 'white') {
      return 'loss'; // White (player) has no moves and is checkmated - player lost
    } else {
      return 'win'; // Black (bot) has no moves and is checkmated - player won
    }
  };

  const gameResult = getGameResult();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Sjakkbrett
        </ThemedText>
        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <ThemedText style={styles.newGameButtonText}>Nytt spill</ThemedText>
        </TouchableOpacity>
      </View>

      {renderPlayerInfo(opponent, true)}

      <View style={styles.board}>
        {renderBoard()}
      </View>

      {renderPlayerInfo(player, false)}

      <GameOverModal
        visible={gameResult !== null}
        result={gameResult || 'draw'}
        onNewGame={handleNewGame}
        opponentDifficulty="easy"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  playerDetails: {
    flex: 1,
    gap: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerRating: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorIndicator: {
    alignItems: 'center',
    gap: 4,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  colorText: {
    fontSize: 12,
    opacity: 0.7,
  },
  board: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 500,
    borderWidth: 2,
    borderColor: '#333',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSquare: {
    backgroundColor: '#baca44',
  },
  legalMoveDot: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  attackedSquareCross: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossLine1: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    transform: [{ rotate: '45deg' }],
  },
  crossLine2: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    transform: [{ rotate: '-45deg' }],
  },
  pieceImage: {
    width: '80%',
    height: '80%',
  },
});
