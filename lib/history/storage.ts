import AsyncStorage from "@react-native-async-storage/async-storage";

import { GameRecord } from "./types";

const STORAGE_KEY = "@thomas-sjakk/game-history/v1";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortDescending(records: GameRecord[]): GameRecord[] {
  return [...records].sort((a, b) => b.playedAt.localeCompare(a.playedAt));
}

export async function getHistory(): Promise<GameRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return sortDescending(parsed as GameRecord[]);
  } catch (error) {
    console.warn("[history] Failed to read history", error);
    return [];
  }
}

export async function addGame(
  input: Omit<GameRecord, "id" | "playedAt">
): Promise<GameRecord> {
  const record: GameRecord = {
    ...input,
    id: generateId(),
    playedAt: new Date().toISOString(),
  };

  try {
    const existing = await getHistory();
    const next = sortDescending([record, ...existing]);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn("[history] Failed to persist game", error);
  }

  return record;
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("[history] Failed to clear history", error);
  }
}
