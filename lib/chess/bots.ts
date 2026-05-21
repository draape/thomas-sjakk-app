import { BotDifficulty } from "@/lib/chess/ai";
import { PlayerInfo } from "@/lib/chess/types";

export interface BotConfigEntry {
  info: PlayerInfo;
  description: string;
  badge: string;
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
  },
};

export const BOT_ORDER: BotDifficulty[] = [
  "easy",
  "medium",
  "hard",
  "pro",
  "super",
];
