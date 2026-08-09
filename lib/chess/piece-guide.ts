import { BoardState, PieceColor, PieceType } from "./types";

export interface DemoPiece {
  square: string;
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface PieceGuide {
  type: PieceType;
  name: string;
  movement: string[];
  // Where the piece stands on the demo board (12x12 keys, e.g. "f6").
  demoSquare: string;
  // Pawns need hasMoved=false to show their two-square first move.
  demoHasMoved?: boolean;
  // Extra pieces used to illustrate a rule (e.g. a target the piece can take).
  extras?: DemoPiece[];
}

// Ordered from simplest/least valuable to most valuable, matching the value
// table in spec/regler/generelt.md.
export const PIECE_GUIDES: PieceGuide[] = [
  {
    type: "bonde",
    name: "Bonde",
    movement: [
      "Går rett frem, ett felt om gangen.",
      "Første gang den flytter kan den gå to felter frem.",
      "Tar motstandere skrått, ett felt frem til siden.",
      "Kan ikke hoppe over andre brikker.",
      "Blir til en dronning når den når helt frem.",
    ],
    demoSquare: "f4",
    demoHasMoved: false,
    extras: [
      { square: "e5", type: "bonde", color: "black" },
      { square: "g5", type: "bonde", color: "black" },
    ],
  },
  {
    type: "hest",
    name: "Hest",
    movement: [
      "Hopper i en L: to felter frem og ett til siden.",
      "Kan hoppe til alle fire kanter.",
      "Kan hoppe over både egne og motstanderens brikker.",
    ],
    demoSquare: "f6",
  },
  {
    type: "løper",
    name: "Løper",
    movement: [
      "Går bare skrått.",
      "Kan gå så mange felter den vil.",
      "Blir alltid på samme farge som den startet på.",
      "Kan ikke hoppe over andre brikker.",
    ],
    demoSquare: "f6",
  },
  {
    type: "tårn",
    name: "Tårn",
    movement: [
      "Går rett frem, bakover og til sidene.",
      "Kan gå så mange felter den vil.",
      "Kan ikke hoppe over andre brikker.",
    ],
    demoSquare: "f6",
  },
  {
    type: "sverd",
    name: "Sverd",
    movement: [
      "Går skrått, som løperen.",
      "Kan gå så mange felter den vil.",
      "Kan hoppe over egne brikker, men ikke motstanderens.",
    ],
    demoSquare: "f6",
  },
  {
    type: "skjold",
    name: "Skjold",
    movement: [
      "Går rett frem, bakover og til sidene.",
      "Kan gå så mange felter den vil.",
      "Kan hoppe over alle brikker.",
    ],
    demoSquare: "f6",
  },
  {
    type: "dronning",
    name: "Dronning",
    movement: [
      "Går i alle retninger, også skrått.",
      "Kan gå så mange felter den vil.",
      "Kan ikke hoppe over andre brikker.",
    ],
    demoSquare: "f6",
  },
  {
    type: "ridder",
    name: "Ridder",
    movement: [
      "Går i alle retninger, også skrått.",
      "Kan gå så mange felter den vil.",
      "Kan hoppe over egne brikker, men ikke motstanderens.",
    ],
    demoSquare: "f6",
  },
  {
    type: "konge",
    name: "Konge",
    movement: [
      "Går ett felt om gangen, i alle retninger.",
      "Kan ikke gå til et felt der den kan bli tatt.",
      "Passer godt på — mister du kongen, taper du.",
    ],
    demoSquare: "f6",
  },
];

// Builds a demo board with the guide's piece (white) and any illustrative
// extras, so the rules screen can show the piece's legal moves as dots.
export const buildGuideBoard = (guide: PieceGuide): BoardState => {
  const board: BoardState = {
    [guide.demoSquare]: {
      type: guide.type,
      color: "white",
      hasMoved: guide.demoHasMoved ?? true,
    },
  };

  guide.extras?.forEach((extra) => {
    board[extra.square] = {
      type: extra.type,
      color: extra.color,
      hasMoved: extra.hasMoved ?? true,
    };
  });

  return board;
};
