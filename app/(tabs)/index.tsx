import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useGameHistory } from "@/hooks/use-game-history";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRating } from "@/hooks/use-rating";
import { BOT_CONFIG } from "@/lib/chess/bots";
import { formatPlayedAt } from "@/lib/history/format";
import { GameRecord, MatchOutcome } from "@/lib/history/types";

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
    <View style={styles.historyCard}>
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
    </View>
  );
}

export default function HomeScreen() {
  const { history } = useGameHistory();
  const { current, peak } = useRating();
  const backgroundColor = useThemeColor({}, "background");

  const currentLabel = current === null ? "-" : String(current);
  const peakLabel = peak === null ? "-" : String(peak);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            Velkommen til{"\n"}Thomas-sjakk!
          </ThemedText>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingStats}>
            <View style={styles.ratingStat}>
              <ThemedText style={styles.ratingLabel}>Nå</ThemedText>
              <ThemedText style={styles.ratingValue}>
                {currentLabel}
              </ThemedText>
            </View>
            <View style={styles.ratingDivider} />
            <View style={styles.ratingStat}>
              <ThemedText style={styles.ratingLabel}>Rekord</ThemedText>
              <ThemedText style={styles.ratingValue}>{peakLabel}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.historyContainer}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    lineHeight: 38,
  },
  ratingContainer: {
    marginBottom: 24,
    paddingVertical: 20,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  ratingStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  ratingStat: {
    alignItems: "center",
    gap: 4,
    minWidth: 120,
  },
  ratingLabel: {
    fontSize: 14,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ratingValue: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 48,
  },
  ratingDivider: {
    width: 1,
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  historyContainer: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    gap: 14,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarFallback: {
    fontSize: 32,
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    fontSize: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 2,
    overflow: "hidden",
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyDetail: {
    fontSize: 12,
    opacity: 0.6,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  emptyState: {
    textAlign: "center",
    opacity: 0.6,
    paddingVertical: 32,
  },
});
