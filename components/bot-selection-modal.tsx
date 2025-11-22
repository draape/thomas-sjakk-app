import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BotDifficulty } from "@/lib/chess/ai";

interface BotOption {
  difficulty: BotDifficulty;
  title: string;
  description: string;
  badge?: string;
}

interface BotSelectionModalProps {
  visible: boolean;
  options: BotOption[];
  onSelect: (difficulty: BotDifficulty) => void;
}

export function BotSelectionModal({
  visible,
  options,
  onSelect,
}: BotSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ThemedText type="title" style={styles.title}>
            Velg motstander
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Hver bot gir en unik utfordring
          </ThemedText>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.difficulty}
                style={styles.optionButton}
                onPress={() => onSelect(option.difficulty)}
              >
                <View style={styles.optionHeader}>
                  <ThemedText type="defaultSemiBold">
                    {option.title}
                  </ThemedText>
                  {option.badge ? (
                    <ThemedText style={styles.badge}>{option.badge}</ThemedText>
                  ) : null}
                </View>
                <ThemedText style={styles.optionDescription}>
                  {option.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 420,
    alignItems: "stretch",
    gap: 16,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  badge: {
    fontSize: 18,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});
