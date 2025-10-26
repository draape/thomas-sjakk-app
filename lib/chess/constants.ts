export const BOARD_SIZE = 12;
export const LIGHT_COLOR = "#ebebd0";
export const DARK_COLOR = "#7f9459";

export const PIECE_SVGS = {
  white: {
    bonde: require("@/assets/svg/white/bonde.svg"),
    dronning: require("@/assets/svg/white/dronning.svg"),
    konge: require("@/assets/svg/white/konge.svg"),
    tårn: require("@/assets/svg/white/tårn.svg"),
    løper: require("@/assets/svg/white/løper.svg"),
    hest: require("@/assets/svg/white/hest.svg"),
    sverd: require("@/assets/svg/white/sverd.svg"),
  },
  black: {
    bonde: require("@/assets/svg/black/bonde.svg"),
    dronning: require("@/assets/svg/black/dronning.svg"),
    konge: require("@/assets/svg/black/konge.svg"),
    tårn: require("@/assets/svg/black/tårn.svg"),
    løper: require("@/assets/svg/black/løper.svg"),
    hest: require("@/assets/svg/black/hest.svg"),
    sverd: require("@/assets/svg/black/sverd.svg"),
  },
};

export const INITIAL_POSITIONS = {
  WHITE_KING: "g1",
  BLACK_KING: "g12",
  WHITE_QUEEN: "f1",
  BLACK_QUEEN: "f12",
  WHITE_ROOKS: ["a1", "k1"],
  BLACK_ROOKS: ["a12", "k12"],
  WHITE_BISHOPS: ["c1", "j1"],
  BLACK_BISHOPS: ["c12", "j12"],
  WHITE_KNIGHTS: ["d1", "h1"],
  BLACK_KNIGHTS: ["d12", "h12"],
  WHITE_SWORDS: ["b1", "i1"],
  BLACK_SWORDS: ["b12", "i12"],
};