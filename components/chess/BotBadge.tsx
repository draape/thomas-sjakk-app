import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { FontFamily, Palette } from "@/constants/theme";
import { BadgeKind } from "@/lib/chess/bots";

const MEDAL: Record<
  "bronze" | "silver" | "gold",
  { num: number; bg: string }
> = {
  gold: { num: 1, bg: Palette.medalGold },
  silver: { num: 2, bg: Palette.medalSilver },
  bronze: { num: 3, bg: Palette.medalBronze },
};

export function BotBadge({
  kind,
  size = 22,
}: {
  kind: BadgeKind;
  size?: number;
}) {
  if (kind === "trophy") {
    return (
      <MaterialCommunityIcons name="trophy" size={size} color={Palette.accent} />
    );
  }
  if (kind === "gem") {
    return <Ionicons name="diamond" size={size} color={Palette.sky} />;
  }

  const medal = MEDAL[kind];
  const dim = size + 6;
  return (
    <View
      style={[
        styles.medal,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: medal.bg,
        },
      ]}
    >
      <Text style={[styles.medalNum, { fontSize: dim * 0.58 }]}>
        {medal.num}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  medal: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  medalNum: {
    fontFamily: FontFamily.headingExtra,
    color: "#fff",
    lineHeight: undefined,
    includeFontPadding: false,
    textAlign: "center",
  },
});
