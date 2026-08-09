import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { BotBadge } from "@/components/chess/BotBadge";
import { ThemedText } from "@/components/themed-text";
import { FontFamily, Palette, Radius } from "@/constants/theme";
import { BadgeKind } from "@/lib/chess/bots";
import { PlayerInfo as PlayerInfoType } from "@/lib/chess/types";

interface PlayerInfoProps {
  player: PlayerInfoType;
  badgeKind?: BadgeKind;
}

export function PlayerInfo({ player, badgeKind }: PlayerInfoProps) {
  const isBlack = player.color === "Svart";

  return (
    <View style={styles.row}>
      <View style={styles.avatarWrapper}>
        <Image source={player.avatar} style={styles.avatar} contentFit="cover" />
        {badgeKind && (
          <View style={styles.badgeCircle}>
            <BotBadge kind={badgeKind} size={18} />
          </View>
        )}
      </View>

      <View style={styles.details}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {player.name}
        </ThemedText>
        <ThemedText style={styles.rating}>Rating: {player.rating}</ThemedText>
      </View>

      <View style={styles.sideIndicator}>
        <View
          style={[
            styles.sideCircle,
            { backgroundColor: isBlack ? Palette.text : "transparent" },
          ]}
        />
        <ThemedText style={styles.sideText}>{player.color}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    position: "relative",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 18,
    color: Palette.text,
  },
  rating: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    color: Palette.mutedForeground,
  },
  sideIndicator: {
    alignItems: "center",
    gap: 4,
  },
  sideCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Palette.text,
  },
  sideText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 12,
    color: Palette.mutedForeground,
  },
});
