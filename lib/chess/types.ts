export type PieceColor = "white" | "black";
export type PieceType = "bonde" | "dronning" | "konge" | "tårn" | "løper";
export type GameStatus = "ongoing" | "checkmate" | "stalemate";

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface BoardState {
  [key: string]: Piece;
}

export interface Position {
  row: number;
  col: number;
}

export interface LastMove {
  from: string;
  to: string;
  movedTwoSquares: boolean;
}

export interface GameResult {
  status: GameStatus;
  winner?: PieceColor;
}

export interface PlayerInfo {
  name: string;
  rating: number;
  color: string;
  avatar: any;
}