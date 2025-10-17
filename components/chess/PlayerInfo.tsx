import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PlayerInfo as PlayerInfoType } from "@/lib/chess/types";

interface PlayerInfoProps {
  player: PlayerInfoType;
}

export function PlayerInfo({ player }: PlayerInfoProps) {
  return (
    <View style={styles.playerInfo}>
      <View style={styles.avatar}>
        <Image
          source={player.avatar}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.playerDetails}>
        <ThemedText style={styles.playerName}>{player.name}</ThemedText>
        <ThemedText style={styles.playerRating}>
          Rating: {player.rating}
        </ThemedText>
      </View>
      <View style={styles.colorIndicator}>
        <View
          style={[
            styles.colorCircle,
            {
              backgroundColor: player.color === "Hvit" ? "#fff" : "#000",
            },
          ]}
        />
        <ThemedText style={styles.colorText}>{player.color}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  playerDetails: {
    flex: 1,
    gap: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playerRating: {
    fontSize: 14,
    opacity: 0.7,
  },
  colorIndicator: {
    alignItems: "center",
    gap: 4,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  colorText: {
    fontSize: 12,
    opacity: 0.7,
  },
});