import { BotDifficulty } from "@/lib/chess/ai";
import { PlayerInfo } from "@/lib/chess/types";

export type BadgeKind = "bronze" | "silver" | "gold" | "trophy" | "gem";

export interface BotConfigEntry {
  info: PlayerInfo;
  description: string;
  /** Emoji fallback badge (used where a full icon badge is not rendered). */
  badge: string;
  /** Medal/icon badge kind shown next to the bot. */
  badgeKind: BadgeKind;
  /** Difficulty 1-5, drives the level pips. */
  difficulty: number;
}

export const BOT_CONFIG: Record<BotDifficulty, BotConfigEntry> = {
  easy: {
    info: {
      name: "EasyBot 1000",
      rating: 1200,
      color: "Svart",
      avatar: require("@/assets/images/easybot.jpg"),
    },
    description: "Velg dette for helt tilfeldige trekk.",
    badge: "🥉",
    badgeKind: "bronze",
    difficulty: 1,
  },
  medium: {
    info: {
      name: "MediumBot 2000",
      rating: 1350,
      color: "Svart",
      avatar: require("@/assets/images/easybot.jpg"),
    },
    description: "Tar brikker når det er mulig, ellers tilfeldig trekk.",
    badge: "🥈",
    badgeKind: "silver",
    difficulty: 2,
  },
  hard: {
    info: {
      name: "HardBot 3000",
      rating: 1500,
      color: "Svart",
      avatar: require("@/assets/images/easybot.jpg"),
    },
    description: "Prioriterer å ta eller true Thomas sine brikker.",
    badge: "🥇",
    badgeKind: "gold",
    difficulty: 3,
  },
  pro: {
    info: {
      name: "ProBot 4000",
      rating: 1650,
      color: "Svart",
      avatar: require("@/assets/images/easybot.jpg"),
    },
    description: "Tar eller truer de dyreste brikkene først.",
    badge: "🏆",
    badgeKind: "trophy",
    difficulty: 4,
  },
  super: {
    info: {
      name: "SuperBot 5000",
      rating: 1800,
      color: "Svart",
      avatar: require("@/assets/images/easybot.jpg"),
    },
    description:
      "Kjenner brikkeverdier og unngår trekk som taper mer enn de vinner.",
    badge: "💎",
    badgeKind: "gem",
    difficulty: 5,
  },
};

export const BOT_ORDER: BotDifficulty[] = [
  "easy",
  "medium",
  "hard",
  "pro",
  "super",
];
