import { BotDifficulty } from "@/lib/chess/ai";

export type MatchOutcome = "win" | "loss" | "draw";

export interface GameRecord {
  id: string;
  playedAt: string;
  opponentDifficulty: BotDifficulty;
  opponentName: string;
  opponentRating: number;
  result: MatchOutcome;
}
