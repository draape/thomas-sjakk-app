import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';

const BOARD_SIZE = 12;
const LIGHT_COLOR = '#ebebd0';
const DARK_COLOR = '#7f9459';

// Piece types
type PieceColor = 'white' | 'black';
type PieceType = 'bonde';

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

// Initial board setup - using 1-indexed rows (1 = bottom, 12 = top)
// EasyBot (white) plays from top, so white pieces start at row 11
// Thomas (black) plays from bottom, so black pieces start at row 2
const createInitialBoard = (): BoardState => {
  const board: BoardState = {};
  // Black pawns on row 2 (Thomas at bottom)
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
    board[`${colLetter}2`] = { type: 'bonde', color: 'black', hasMoved: false };
  }
  // White pawns on row 11 (EasyBot at top)
  for (let col = 0; col < 12; col++) {
    const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
    board[`${colLetter}11`] = { type: 'bonde', color: 'white', hasMoved: false };
  }
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
  return null;
};

// Calculate legal moves for a pawn
const calculateLegalMoves = (board: BoardState, position: string): string[] => {
  const piece = board[position];
  if (!piece || piece.type !== 'bonde') return [];

  const { row, col } = keyToPosition(position);
  const legalMoves: string[] = [];

  // Pawns move forward based on color
  // White (top) moves down (increasing row in display), Black (bottom) moves up (decreasing row in display)
  const direction = piece.color === 'white' ? -1 : 1;

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

  return legalMoves;
};

// Player info
const opponent = {
  name: 'EasyBot 1000',
  rating: 1200,
  color: 'Hvit',
  avatar: require('@/assets/images/easybot.jpg'),
};

const player = {
  name: 'Thomas',
  rating: 1450,
  color: 'Svart',
  avatar: require('@/assets/images/thomas.jpg'),
};

export default function ChessBoardScreen() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('black'); // Thomas starts

  const handleSquarePress = (row: number, col: number) => {
    const key = positionToKey(row, col);
    const piece = board[key];

    // If clicking on a legal move, move the piece
    if (selectedSquare && legalMoves.includes(key)) {
      const newBoard = { ...board };
      const movingPiece = newBoard[selectedSquare];

      // Move the piece
      newBoard[key] = { ...movingPiece, hasMoved: true };
      delete newBoard[selectedSquare];

      setBoard(newBoard);
      setSelectedSquare(null);
      setLegalMoves([]);
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
    // If clicking on own piece, select it
    else if (piece && piece.color === currentPlayer) {
      setSelectedSquare(key);
      setLegalMoves(calculateLegalMoves(board, key));
    }
    // If clicking elsewhere, deselect
    else {
      setSelectedSquare(null);
      setLegalMoves([]);
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

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sjakkbrett
      </ThemedText>

      {renderPlayerInfo(opponent, true)}

      <View style={styles.board}>
        {renderBoard()}
      </View>

      {renderPlayerInfo(player, false)}
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
  title: {
    marginBottom: 20,
    fontSize: 28,
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
  pieceImage: {
    width: '80%',
    height: '80%',
    contentFit: 'contain',
  },
});
