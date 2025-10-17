import { StyleSheet, View } from "react-native";
import { ChessSquare } from "./ChessSquare";
import { BoardState } from "@/lib/chess/types";
import { positionToKey } from "@/lib/chess/utils";
import { BOARD_SIZE } from "@/lib/chess/constants";

interface ChessBoardProps {
  board: BoardState;
  selectedSquare: string | null;
  legalMoves: string[];
  attackedSquares: string[];
  onSquarePress: (row: number, col: number) => void;
}

export function ChessBoard({
  board,
  selectedSquare,
  legalMoves,
  attackedSquares,
  onSquarePress,
}: ChessBoardProps) {
  const renderBoard = () => {
    const rows = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const squares = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const isLight = (row + col) % 2 === 0;
        const key = positionToKey(row, col);
        const piece = board[key];
        const isSelected = selectedSquare === key;
        const isLegalMove = legalMoves.includes(key);
        const isUnderAttack = attackedSquares.includes(key);

        squares.push(
          <ChessSquare
            key={`${row}-${col}`}
            piece={piece}
            isLight={isLight}
            isSelected={isSelected}
            isLegalMove={isLegalMove}
            isUnderAttack={isUnderAttack}
            onPress={() => onSquarePress(row, col)}
          />
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

  return <View style={styles.board}>{renderBoard()}</View>;
}

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 500,
    borderWidth: 2,
    borderColor: "#333",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
});