import { calculateLegalMoves } from "./game";
import { BoardState, LastMove } from "./types";

export interface RuleDemo {
  board: BoardState;
  selectedSquare: string | null;
  legalMoves: string[];
  attackedSquares: string[];
}

export interface RuleGuide {
  id: string;
  name: string;
  emoji: string;
  intro: string;
  // One line explaining what the highlight on the demo board means.
  hint: string;
  description: string[];
  demo: RuleDemo;
}

// --- En passant -----------------------------------------------------------
// Black pawn just advanced d7 -> d5, sliding past the white pawn on e5.
// Passing the matching lastMove lets the real engine surface the en passant
// capture on d6, so the example can never drift from the game rules.
const enPassantBoard: BoardState = {
  e5: { type: "bonde", color: "white", hasMoved: true },
  d5: { type: "bonde", color: "black", hasMoved: true },
};
const enPassantLastMove: LastMove = {
  from: "d7",
  to: "d5",
  movedTwoSquares: true,
};

// --- Sjakk matt -----------------------------------------------------------
// Two-rook "ladder" mate in the corner: h12 checks the king along row 12 and
// h11 seals row 11, so a12 has no escape.
const checkmateBoard: BoardState = {
  a12: { type: "konge", color: "black", hasMoved: true },
  h12: { type: "tårn", color: "white", hasMoved: true },
  h11: { type: "tårn", color: "white", hasMoved: true },
};

// --- Sjakk patt -----------------------------------------------------------
// The queen on b10 covers b11, b12 and a11 without ever attacking a12, so the
// king is not in check yet has no legal move.
const stalemateBoard: BoardState = {
  a12: { type: "konge", color: "black", hasMoved: true },
  b10: { type: "dronning", color: "white", hasMoved: true },
};

export const RULE_GUIDES: RuleGuide[] = [
  {
    id: "en-passant",
    name: "En passant",
    emoji: "🏃",
    intro: "En spesiell måte å ta en bonde på.",
    hint: "Prikken på d6 viser hvor bonden tar. Krysset er bonden som blir tatt.",
    description: [
      "Den svarte bonden gikk nettopp to felter frem, forbi den hvite bonden.",
      "Rett etterpå kan den hvite bonden ta den, som om den bare gikk ett felt.",
      "Den hvite bonden flytter skrått til d6 og tar bonden på d5.",
      "Dette må gjøres med én gang, ellers forsvinner sjansen.",
    ],
    demo: {
      board: enPassantBoard,
      selectedSquare: "e5",
      legalMoves: calculateLegalMoves(enPassantBoard, "e5", enPassantLastMove),
      attackedSquares: ["d5"],
    },
  },
  {
    id: "sjakk-matt",
    name: "Sjakk matt",
    emoji: "🏁",
    intro: "Spillet er over – noen har vunnet.",
    hint: "Krysset viser kongen som står i sjakk, uten et eneste trygt felt.",
    description: [
      "Den svarte kongen står i sjakk – den blir angrepet.",
      "Kongen kan ikke flytte til et trygt felt.",
      "Ingen annen brikke kan stoppe angrepet.",
      "Da er det sjakk matt, og den som angriper vinner.",
    ],
    demo: {
      board: checkmateBoard,
      selectedSquare: null,
      legalMoves: [],
      attackedSquares: ["a12"],
    },
  },
  {
    id: "sjakk-patt",
    name: "Sjakk patt",
    emoji: "🤝",
    intro: "Spillet ender uavgjort.",
    hint: "Kongen er markert: den kan ikke flytte, men står ikke i sjakk.",
    description: [
      "Den svarte kongen står IKKE i sjakk.",
      "Men kongen har ingen lovlige trekk å gjøre.",
      "Ingen andre brikker kan flytte heller.",
      "Da blir det sjakk patt – uavgjort, ingen vinner.",
    ],
    demo: {
      board: stalemateBoard,
      selectedSquare: "a12",
      legalMoves: [],
      attackedSquares: [],
    },
  },
];
