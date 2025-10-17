import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { Piece } from "@/lib/chess/types";
import { PIECE_SVGS } from "@/lib/chess/constants";

interface ChessPieceProps {
  piece: Piece;
}

export function ChessPiece({ piece }: ChessPieceProps) {
  const PieceSvg = PIECE_SVGS[piece.color][piece.type];
  
  return <Image source={PieceSvg} style={styles.pieceImage} />;
}

const styles = StyleSheet.create({
  pieceImage: {
    width: "80%",
    height: "80%",
  },
});