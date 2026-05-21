import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

import {
  addGame as persistGame,
  getHistory,
} from "@/lib/history/storage";
import { GameRecord } from "@/lib/history/types";

export interface UseGameHistoryResult {
  history: GameRecord[];
  isLoading: boolean;
  addGame: (input: Omit<GameRecord, "id" | "playedAt">) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useGameHistory(): UseGameHistoryResult {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const records = await getHistory();
    setHistory(records);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const addGame = useCallback(
    async (input: Omit<GameRecord, "id" | "playedAt">) => {
      const record = await persistGame(input);
      setHistory((prev) => [record, ...prev]);
    },
    []
  );

  return { history, isLoading, addGame, refresh };
}
