import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChessBoard } from "@/components/chess/ChessBoard";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PIECE_SVGS } from "@/lib/chess/constants";
import { calculateLegalMoves } from "@/lib/chess/game";
import {
  buildGuideBoard,
  PIECE_GUIDES,
  PieceGuide,
} from "@/lib/chess/piece-guide";
import { RULE_GUIDES } from "@/lib/chess/rule-guide";
import { PieceType } from "@/lib/chess/types";

function PieceChip({
  guide,
  isSelected,
  onPress,
}: {
  guide: PieceGuide;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={PIECE_SVGS.white[guide.type]} style={styles.chipPiece} />
      <ThemedText
        style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}
      >
        {guide.name}
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function RulesScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [selectedType, setSelectedType] = useState<PieceType>(
    PIECE_GUIDES[0].type
  );
  const [selectedRuleId, setSelectedRuleId] = useState<string>(
    RULE_GUIDES[0].id
  );

  const guide = useMemo(
    () => PIECE_GUIDES.find((g) => g.type === selectedType) ?? PIECE_GUIDES[0],
    [selectedType]
  );

  const rule = useMemo(
    () => RULE_GUIDES.find((r) => r.id === selectedRuleId) ?? RULE_GUIDES[0],
    [selectedRuleId]
  );

  const { board, legalMoves } = useMemo(() => {
    const demoBoard = buildGuideBoard(guide);
    return {
      board: demoBoard,
      legalMoves: calculateLegalMoves(demoBoard, guide.demoSquare),
    };
  }, [guide]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Hvordan spille 📖
        </ThemedText>
        <ThemedText style={styles.intro}>
          Trykk på en brikke for å lære hvordan den flytter.
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {PIECE_GUIDES.map((g) => (
            <PieceChip
              key={g.type}
              guide={g}
              isSelected={g.type === selectedType}
              onPress={() => setSelectedType(g.type)}
            />
          ))}
        </ScrollView>

        <View style={styles.detailCard}>
          <ThemedText type="subtitle" style={styles.pieceName}>
            {guide.name}
          </ThemedText>

          <View style={styles.boardWrapper}>
            <ChessBoard
              board={board}
              selectedSquare={guide.demoSquare}
              legalMoves={legalMoves}
              attackedSquares={[]}
              onSquarePress={() => {}}
            />
          </View>
          <ThemedText style={styles.boardHint}>
            Prikkene viser hvor brikken kan flytte.
          </ThemedText>

          <View style={styles.movementList}>
            {guide.movement.map((line) => (
              <View key={line} style={styles.movementItem}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.movementText}>{line}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <ThemedText type="subtitle" style={styles.ruleHeading}>
          Spesielle regler
        </ThemedText>
        <ThemedText style={styles.intro}>
          Trykk på en regel for å se hvordan den fungerer.
        </ThemedText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {RULE_GUIDES.map((r) => {
            const isSelected = r.id === selectedRuleId;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.ruleChip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedRuleId(r.id)}
                activeOpacity={0.7}
              >
                <ThemedText style={styles.ruleChipEmoji}>{r.emoji}</ThemedText>
                <ThemedText
                  style={[
                    styles.chipLabel,
                    isSelected && styles.chipLabelSelected,
                  ]}
                >
                  {r.name}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.detailCard}>
          <ThemedText type="subtitle" style={styles.pieceName}>
            {rule.name}
          </ThemedText>
          <ThemedText style={styles.ruleIntro}>{rule.intro}</ThemedText>

          <View style={styles.boardWrapper}>
            <ChessBoard
              board={rule.demo.board}
              selectedSquare={rule.demo.selectedSquare}
              legalMoves={rule.demo.legalMoves}
              attackedSquares={rule.demo.attackedSquares}
              onSquarePress={() => {}}
            />
          </View>
          <ThemedText style={styles.boardHint}>{rule.hint}</ThemedText>

          <View style={styles.movementList}>
            {rule.description.map((line) => (
              <View key={line} style={styles.movementItem}>
                <ThemedText style={styles.bullet}>•</ThemedText>
                <ThemedText style={styles.movementText}>{line}</ThemedText>
              </View>
            ))}
          </View>
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
  title: {
    marginBottom: 4,
  },
  intro: {
    opacity: 0.6,
    marginBottom: 16,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 4,
    paddingRight: 8,
  },
  chip: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    minWidth: 64,
  },
  chipSelected: {
    backgroundColor: "#4CAF50",
  },
  chipPiece: {
    width: 32,
    height: 32,
  },
  ruleChip: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    minWidth: 88,
  },
  ruleChipEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  chipLabelSelected: {
    color: "#fff",
  },
  detailCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    gap: 12,
  },
  pieceName: {
    textAlign: "center",
  },
  ruleHeading: {
    marginTop: 32,
    marginBottom: 4,
  },
  ruleIntro: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: -4,
  },
  boardWrapper: {
    alignItems: "center",
  },
  boardHint: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: "center",
  },
  movementList: {
    gap: 8,
    marginTop: 4,
  },
  movementItem: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
  },
  movementText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
