import { GameRecord, MatchOutcome } from "@/lib/history/types";

export const START_RATING = 1000;
export const RATING_FLOOR = 100;
export const PROVISIONAL_GAMES = 20;
export const K_PROVISIONAL = 40;
export const K_ESTABLISHED = 20;

export interface RatingSnapshot {
  current: number | null;
  peak: number | null;
}

const SCORE: Record<MatchOutcome, number> = {
  win: 1,
  draw: 0.5,
  loss: 0,
};

function expectedScore(playerRating: number, botRating: number): number {
  return 1 / (1 + Math.pow(10, (botRating - playerRating) / 400));
}

export function calculateRating(history: GameRecord[]): RatingSnapshot {
  if (history.length === 0) {
    return { current: null, peak: null };
  }

  const ordered = [...history].sort((a, b) =>
    a.playedAt.localeCompare(b.playedAt)
  );

  let rating = START_RATING;
  let peak = START_RATING;

  ordered.forEach((game, index) => {
    const k = index < PROVISIONAL_GAMES ? K_PROVISIONAL : K_ESTABLISHED;
    const expected = expectedScore(rating, game.opponentRating);
    const actual = SCORE[game.result];
    const next = Math.max(
      RATING_FLOOR,
      Math.round(rating + k * (actual - expected))
    );
    rating = next;
    if (rating > peak) peak = rating;
  });

  return { current: rating, peak };
}
