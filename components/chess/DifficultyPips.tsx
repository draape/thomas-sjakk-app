import { StyleSheet, View } from "react-native";

import { Palette } from "@/constants/theme";

export function DifficultyPips({ level }: { level: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.pip,
            { backgroundColor: i < level ? Palette.primary : Palette.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
