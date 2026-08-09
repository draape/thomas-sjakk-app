import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BotBadge } from "@/components/chess/BotBadge";
import { DifficultyPips } from "@/components/chess/DifficultyPips";
import { ThemedText } from "@/components/themed-text";
import { FontFamily, Palette, Radius } from "@/constants/theme";
import { BotDifficulty } from "@/lib/chess/ai";
import { BOT_CONFIG, BOT_ORDER } from "@/lib/chess/bots";

interface BotSelectionModalProps {
  visible: boolean;
  onSelect: (difficulty: BotDifficulty) => void;
  onClose?: () => void;
}

export function BotSelectionModal({
  visible,
  onSelect,
  onClose,
}: BotSelectionModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => onClose?.()}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Lukk"
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.header}>
            <View style={styles.grabber} />
            <ThemedText type="title" style={styles.title}>
              Velg motstander
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Hver bot gir en unik utfordring
            </ThemedText>
          </View>

          {onClose && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Lukk"
            >
              <Ionicons name="close" size={22} color={Palette.mutedForeground} />
            </TouchableOpacity>
          )}

          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {BOT_ORDER.map((difficulty, index) => {
              const config = BOT_CONFIG[difficulty];
              return (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.option,
                    { borderColor: index === 0 ? Palette.sky : Palette.border },
                  ]}
                  onPress={() => onSelect(difficulty)}
                  activeOpacity={0.85}
                >
                  <Image source={config.info.avatar} style={styles.avatar} />
                  <View style={styles.optionInfo}>
                    <View style={styles.optionTitleRow}>
                      <ThemedText style={styles.optionName} numberOfLines={1}>
                        {config.info.name}
                      </ThemedText>
                      <BotBadge kind={config.badgeKind} size={22} />
                    </View>
                    <ThemedText style={styles.optionDescription}>
                      {config.description}
                    </ThemedText>
                    <View style={styles.pips}>
                      <DifficultyPips level={config.difficulty} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 36, 46, 0.45)",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: Palette.background,
    borderTopLeftRadius: Radius["3xl"],
    borderTopRightRadius: Radius["3xl"],
  },
  header: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  grabber: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.border,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: "center",
    color: Palette.text,
  },
  subtitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 16,
    color: Palette.mutedForeground,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.card,
    borderWidth: 2,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  optionInfo: {
    flex: 1,
    minWidth: 0,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  optionName: {
    flex: 1,
    fontFamily: FontFamily.bodyExtra,
    fontSize: 20,
    color: Palette.text,
  },
  optionDescription: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 19,
    color: Palette.mutedForeground,
    marginTop: 2,
  },
  pips: {
    marginTop: 8,
  },
});
