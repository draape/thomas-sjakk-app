import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { FontFamily, Palette, Radius } from "@/constants/theme";

type GameResult = "win" | "loss" | "draw";
type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface GameOverModalProps {
  visible: boolean;
  result: GameResult;
  onNewGame: () => void;
  onGoHome: () => void;
}

const CONTENT: Record<
  GameResult,
  {
    title: string;
    subtitle: string;
    icon: MciName;
    ringBg: string;
    iconColor: string;
  }
> = {
  win: {
    title: "Du vant!",
    subtitle: "Bra jobba, Thomas!",
    icon: "trophy",
    ringBg: "rgba(247, 189, 64, 0.25)",
    iconColor: Palette.accentForeground,
  },
  loss: {
    title: "Du tapte",
    subtitle: "Prøv igjen – du klarer det!",
    icon: "heart-broken",
    ringBg: "rgba(222, 59, 61, 0.15)",
    iconColor: Palette.loss,
  },
  draw: {
    title: "Uavgjort!",
    subtitle: "Så jevnt! Vil du ta en revansj?",
    icon: "handshake",
    ringBg: Palette.muted,
    iconColor: Palette.mutedForeground,
  },
};

export function GameOverModal({
  visible,
  result,
  onNewGame,
  onGoHome,
}: GameOverModalProps) {
  const c = CONTENT[result];

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onGoHome}>
      <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
        <View style={styles.top}>
          <View style={[styles.ring, { backgroundColor: c.ringBg }]}>
            <MaterialCommunityIcons name={c.icon} size={84} color={c.iconColor} />
            {result === "win" && (
              <MaterialCommunityIcons
                name="party-popper"
                size={40}
                color={Palette.sky}
                style={styles.party}
              />
            )}
          </View>
          <View style={styles.textBlock}>
            <ThemedText style={styles.title}>{c.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{c.subtitle}</ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={onNewGame}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={26} color={Palette.primaryForeground} />
            <ThemedText style={styles.newGameText}>Nytt spill</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={onGoHome}
            activeOpacity={0.7}
          >
            <Ionicons name="home" size={22} color={Palette.primary} />
            <ThemedText style={styles.homeText}>Hjem</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  ring: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  party: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  textBlock: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontFamily: FontFamily.headingExtra,
    fontSize: 44,
    lineHeight: 50,
    color: Palette.text,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 18,
    color: Palette.mutedForeground,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    gap: 12,
  },
  newGameButton: {
    flexDirection: "row",
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.primary,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  newGameText: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 20,
    color: Palette.primaryForeground,
  },
  homeButton: {
    flexDirection: "row",
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: Radius["2xl"],
  },
  homeText: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 18,
    color: Palette.primary,
  },
});
