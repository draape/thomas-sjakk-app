import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';

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
}

// Import SVG components
const WhiteBonde = require('@/assets/svg/white/bonde.svg');
const BlackBonde = require('@/assets/svg/black/bonde.svg');

// Initial board setup - using 1-indexed rows (1 = bottom, 12 = top)
const initialBoard: { [key: string]: Piece } = {};
// White pawns on row 2
for (let col = 0; col < 12; col++) {
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
  initialBoard[`${colLetter}2`] = { type: 'bonde', color: 'white' };
}
// Black pawns on row 11
for (let col = 0; col < 12; col++) {
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
  initialBoard[`${colLetter}11`] = { type: 'bonde', color: 'black' };
}

// Helper function to get piece at position
const getPiece = (row: number, col: number): Piece | null => {
  // Convert 0-indexed display row to 1-indexed game row (row 0 displays as row 12)
  const gameRow = BOARD_SIZE - row;
  const colLetter = String.fromCharCode('a'.charCodeAt(0) + col);
  const position = `${colLetter}${gameRow}`;
  return initialBoard[position] || null;
};

// Get SVG component for piece
const getPieceSvg = (piece: Piece) => {
  if (piece.type === 'bonde') {
    return piece.color === 'white' ? WhiteBonde : BlackBonde;
  }
  return null;
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
        const piece = getPiece(row, col);
        const PieceSvg = piece ? getPieceSvg(piece) : null;

        squares.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.square,
              { backgroundColor: isLight ? LIGHT_COLOR : DARK_COLOR }
            ]}
          >
            {PieceSvg && (
              <Image source={PieceSvg} style={styles.pieceImage} />
            )}
          </View>
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
  pieceImage: {
    width: '80%',
    height: '80%',
    contentFit: 'contain',
  },
});
