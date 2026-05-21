import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGameHistory } from "@/hooks/use-game-history";
import { BOT_CONFIG } from "@/lib/chess/bots";
import { formatPlayedAt } from "@/lib/history/format";
import { GameRecord, MatchOutcome } from "@/lib/history/types";

const CURRENT_RATING = 1450;
const PEAK_RATING = 1650;

const RESULT_META: Record<
  MatchOutcome,
  { label: string; emoji: string; color: string }
> = {
  win: { label: "Seier", emoji: "🏆", color: "#2e7d32" },
  loss: { label: "Tap", emoji: "💔", color: "#c62828" },
  draw: { label: "Uavgjort", emoji: "🤝", color: "#616161" },
};

function HistoryCard({ entry }: { entry: GameRecord }) {
  const config = BOT_CONFIG[entry.opponentDifficulty];
  const result = RESULT_META[entry.result];

  return (
    <ThemedView style={styles.historyCard}>
      <View style={styles.avatarWrapper}>
        {config ? (
          <Image source={config.info.avatar} style={styles.avatar} />
        ) : (
          <ThemedText style={styles.avatarFallback}>♟️</ThemedText>
        )}
        <ThemedText style={styles.badge}>{config?.badge ?? "♟️"}</ThemedText>
      </View>
      <View style={styles.historyInfo}>
        <ThemedText type="defaultSemiBold">{entry.opponentName}</ThemedText>
        <ThemedText style={styles.historyDetail}>
          Rating: {entry.opponentRating}
        </ThemedText>
        <ThemedText style={[styles.resultText, { color: result.color }]}>
          {result.emoji} {result.label}
        </ThemedText>
        <ThemedText style={styles.historyDetail}>
          {formatPlayedAt(entry.playedAt)}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const { history } = useGameHistory();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Velkommen til Thomas-sjakk!</ThemedText>
        </ThemedView>

        <ThemedView style={styles.historyContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Spillhistorikk 📜
          </ThemedText>

          {history.length === 0 ? (
            <ThemedText style={styles.emptyState}>
              Ingen spilte kamper ennå. Spill din første kamp!
            </ThemedText>
          ) : (
            <View style={styles.historyList}>
              {history.map((entry) => (
                <HistoryCard key={entry.id} entry={entry} />
              ))}
            </View>
          )}
        </ThemedView>

        <ThemedView style={styles.ratingContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Din Rating
          </ThemedText>
          <View style={styles.ratingStats}>
            <View style={styles.ratingStat}>
              <ThemedText style={styles.ratingLabel}>Nå</ThemedText>
              <ThemedText style={styles.ratingValue}>
                {CURRENT_RATING}
              </ThemedText>
            </View>
            <View style={styles.ratingDivider} />
            <View style={styles.ratingStat}>
              <ThemedText style={styles.ratingLabel}>Rekord</ThemedText>
              <ThemedText style={styles.ratingValue}>{PEAK_RATING}</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 32,
    paddingBottom: 64,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  historyContainer: {
    marginTop: 8,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    gap: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    fontSize: 32,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    fontSize: 20,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyDetail: {
    fontSize: 12,
    opacity: 0.7,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  emptyState: {
    textAlign: "center",
    opacity: 0.6,
    paddingVertical: 24,
  },
  ratingContainer: {
    marginTop: 32,
    gap: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  ratingStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  ratingStat: {
    alignItems: "center",
    gap: 8,
  },
  ratingLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
  },
  ratingDivider: {
    width: 1,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
