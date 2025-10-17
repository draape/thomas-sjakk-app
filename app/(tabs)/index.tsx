import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

// Dummy data for trophies
const DUMMY_TROPHIES = [
  {
    id: "1",
    robotName: "EasyBot 1000",
    difficulty: "Lett",
    date: "2024-03-15",
  },
  {
    id: "2",
    robotName: "MediumBot 2000",
    difficulty: "Middels",
    date: "2024-03-20",
  },
  {
    id: "3",
    robotName: "HardBot 3000",
    difficulty: "Vanskelig",
    date: "2024-03-25",
  },
  {
    id: "4",
    robotName: "ProBot 4000",
    difficulty: "Expert",
    date: "2024-03-28",
  },
];

// Dummy rating data
const CURRENT_RATING = 1450;
const PEAK_RATING = 1650;

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Velkommen til Thomas-sjakk!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.trophiesContainer}>
        <ThemedText type="subtitle" style={styles.trophiesTitle}>
          Dine Trofeer 🏆
        </ThemedText>

        <View style={styles.trophiesList}>
          {DUMMY_TROPHIES.map((trophy) => (
            <ThemedView key={trophy.id} style={styles.trophyCard}>
              <View style={styles.trophyIcon}>
                <ThemedText style={styles.trophyEmoji}>🏆</ThemedText>
              </View>
              <View style={styles.trophyInfo}>
                <ThemedText type="defaultSemiBold">
                  {trophy.robotName}
                </ThemedText>
                <ThemedText style={styles.trophyDetail}>
                  Vanskelighetsgrad: {trophy.difficulty}
                </ThemedText>
                <ThemedText style={styles.trophyDetail}>
                  Dato: {trophy.date}
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.ratingContainer}>
        <ThemedText type="subtitle" style={styles.ratingTitle}>
          Din Rating
        </ThemedText>
        <View style={styles.ratingStats}>
          <View style={styles.ratingStat}>
            <ThemedText style={styles.ratingLabel}>Nå</ThemedText>
            <ThemedText style={styles.ratingValue}>{CURRENT_RATING}</ThemedText>
          </View>
          <View style={styles.ratingDivider} />
          <View style={styles.ratingStat}>
            <ThemedText style={styles.ratingLabel}>Rekord</ThemedText>
            <ThemedText style={styles.ratingValue}>{PEAK_RATING}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  trophiesContainer: {
    marginTop: 24,
    gap: 16,
  },
  trophiesTitle: {
    marginBottom: 8,
  },
  trophiesList: {
    gap: 12,
  },
  trophyCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    gap: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  trophyIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
  },
  trophyEmoji: {
    fontSize: 32,
  },
  trophyInfo: {
    flex: 1,
    gap: 4,
  },
  trophyDetail: {
    fontSize: 12,
    opacity: 0.7,
  },
  ratingContainer: {
    marginTop: 24,
    gap: 16,
    alignItems: "center",
    paddingVertical: 8,
  },
  ratingTitle: {
    marginBottom: 8,
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
