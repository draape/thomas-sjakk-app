import { useMemo } from "react";

import { useGameHistory } from "@/hooks/use-game-history";
import { calculateRating, RatingSnapshot } from "@/lib/rating/calculate";

export interface UseRatingResult extends RatingSnapshot {
  isLoading: boolean;
}

export function useRating(): UseRatingResult {
  const { history, isLoading } = useGameHistory();
  const snapshot = useMemo(() => calculateRating(history), [history]);
  return { ...snapshot, isLoading };
}
