import { BOARD_SIZE } from "./constants";
import { Position } from "./types";

export const positionToKey = (row: number, col: number): string => {
  const gameRow = BOARD_SIZE - row;
  const colLetter = String.fromCharCode("a".charCodeAt(0) + col);
  return `${colLetter}${gameRow}`;
};

export const keyToPosition = (key: string): Position => {
  const col = key.charCodeAt(0) - "a".charCodeAt(0);
  const row = BOARD_SIZE - parseInt(key.slice(1));
  return { row, col };
};

export const isValidPosition = (row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
};