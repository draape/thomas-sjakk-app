import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { type ComponentProps } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { FontFamily, Palette, Radius } from "@/constants/theme";
import { useGameHistory } from "@/hooks/use-game-history";
import { useRating } from "@/hooks/use-rating";
import { BOT_CONFIG } from "@/lib/chess/bots";
import { formatPlayedAt } from "@/lib/history/format";
import { GameRecord, MatchOutcome } from "@/lib/history/types";

type ResultIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

const RESULT_META: Record<
  MatchOutcome,
  { label: string; icon: ResultIcon; color: string }
> = {
  win: { label: "Seier", icon: "trophy", color: Palette.win },
  loss: { label: "Tap", icon: "heart-broken", color: Palette.loss },
  draw: { label: "Uavgjort", icon: "handshake", color: Palette.draw },
};

function ResultLabel({ result }: { result: MatchOutcome }) {
  const meta = RESULT_META[result];
  return (
    <View style={styles.resultLabel}>
      <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
      <ThemedText style={[styles.resultText, { color: meta.color }]}>
        {meta.label}
      </ThemedText>
    </View>
  );
}

function HistoryCard({ entry }: { entry: GameRecord }) {
  const config = BOT_CONFIG[entry.opponentDifficulty];

  return (
    <View style={styles.historyCard}>
      <View style={styles.avatarWrapper}>
        {config ? (
          <Image source={config.info.avatar} style={styles.avatar} />
        ) : (
          <ThemedText style={styles.avatarFallback}>♟️</ThemedText>
        )}
        <View style={styles.badgeCircle}>
          <ThemedText style={styles.badgeEmoji}>
            {config?.badge ?? "♟️"}
          </ThemedText>
        </View>
      </View>
      <View style={styles.historyInfo}>
        <ThemedText style={styles.historyName} numberOfLines={1}>
          {entry.opponentName}
        </ThemedText>
        <ThemedText style={styles.historyRating}>
          Rating: {entry.opponentRating}
        </ThemedText>
        <View style={styles.historyResultRow}>
          <ResultLabel result={entry.result} />
          <ThemedText style={styles.historyDate}>
            {formatPlayedAt(entry.playedAt)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { history } = useGameHistory();
  const { current, peak } = useRating();

  const currentLabel = current === null ? "-" : String(current);
  const peakLabel = peak === null ? "-" : String(peak);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={24} color={Palette.accentForeground} />
          </View>
          <ThemedText type="title" style={styles.title}>
            Velkommen til Thomas-sjakk!
          </ThemedText>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statCell}>
            <ThemedText style={styles.statLabel}>Nå</ThemedText>
            <ThemedText style={[styles.statValue, styles.statValueNow]}>
              {currentLabel}
            </ThemedText>
          </View>
          <View style={[styles.statCell, styles.statCellRight]}>
            <ThemedText style={styles.statLabel}>Rekord</ThemedText>
            <ThemedText style={styles.statValue}>{peakLabel}</ThemedText>
          </View>
        </View>

        {/* Play CTA */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.navigate("/explore")}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="sword-cross"
            size={26}
            color={Palette.primaryForeground}
          />
          <ThemedText style={styles.playButtonText}>
            Spill et nytt parti
          </ThemedText>
        </TouchableOpacity>

        {/* History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeading}>
            <MaterialCommunityIcons
              name="script-text-outline"
              size={24}
              color={Palette.accentForeground}
            />
            <ThemedText type="subtitle" style={styles.historyHeadingText}>
              Spillhistorikk
            </ThemedText>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyCard}>
              <ThemedText style={styles.emptyText}>
                Ingen partier ennå – trykk «Spill et nytt parti» for å starte!
              </ThemedText>
            </View>
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

const SHADOW_SM = {
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 4,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 24,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginTop: 4,
    backgroundColor: Palette.accent,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW_SM,
  },
  title: {
    flex: 1,
    fontSize: 36,
    lineHeight: 38,
    color: Palette.text,
  },
  // Stats
  statsCard: {
    flexDirection: "row",
    borderRadius: Radius["3xl"],
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: "hidden",
    ...SHADOW_SM,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 24,
  },
  statCellRight: {
    borderLeftWidth: 1,
    borderLeftColor: Palette.border,
  },
  statLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: Palette.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 48,
    lineHeight: 52,
    color: Palette.text,
  },
  statValueNow: {
    color: Palette.primary,
  },
  // Play button
  playButton: {
    flexDirection: "row",
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    ...SHADOW_MD,
  },
  playButtonText: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 20,
    color: Palette.primaryForeground,
  },
  // History
  historySection: {
    gap: 12,
  },
  historyHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyHeadingText: {
    fontFamily: FontFamily.headingExtra,
    fontSize: 24,
    lineHeight: 30,
    color: Palette.text,
  },
  emptyCard: {
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 20,
    ...SHADOW_SM,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: 16,
    textAlign: "center",
    color: Palette.mutedForeground,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 16,
    ...SHADOW_SM,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    fontSize: 34,
    textAlign: "center",
    lineHeight: 56,
  },
  badgeCircle: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW_SM,
  },
  badgeEmoji: {
    fontSize: 15,
  },
  historyInfo: {
    flex: 1,
    minWidth: 0,
  },
  historyName: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 18,
    color: Palette.text,
  },
  historyRating: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    color: Palette.mutedForeground,
  },
  historyResultRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  resultLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 16,
  },
  historyDate: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    color: Palette.mutedForeground,
  },
});
