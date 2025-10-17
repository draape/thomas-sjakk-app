import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ChessPiece } from "./ChessPiece";
import { Piece } from "@/lib/chess/types";
import { LIGHT_COLOR, DARK_COLOR } from "@/lib/chess/constants";

interface ChessSquareProps {
  piece: Piece | undefined;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  isUnderAttack: boolean;
  onPress: () => void;
}

export function ChessSquare({
  piece,
  isLight,
  isSelected,
  isLegalMove,
  isUnderAttack,
  onPress,
}: ChessSquareProps) {
  return (
    <TouchableOpacity
      style={[
        styles.square,
        { backgroundColor: isLight ? LIGHT_COLOR : DARK_COLOR },
        isSelected && styles.selectedSquare,
      ]}
      onPress={onPress}
    >
      {piece && <ChessPiece piece={piece} />}
      {isLegalMove && <View style={styles.legalMoveDot} />}
      {isUnderAttack && (
        <View style={styles.attackedSquareCross}>
          <View style={styles.crossLine1} />
          <View style={styles.crossLine2} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSquare: {
    backgroundColor: "#baca44",
  },
  legalMoveDot: {
    position: "absolute",
    width: "30%",
    height: "30%",
    borderRadius: 100,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  attackedSquareCross: {
    position: "absolute",
    width: "40%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  crossLine1: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    transform: [{ rotate: "45deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    transform: [{ rotate: "-45deg" }],
  },
});