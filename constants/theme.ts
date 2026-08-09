/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

/**
 * Friendly, kid-facing brand palette. Values are the exact tokens from the v0
 * design (oklch converted to sRGB hex). Used app-wide (both color schemes map
 * to it) so the branded look stays consistent regardless of the system theme.
 */
export const Palette = {
  background: '#FBF9F0',
  card: '#FFFFFF',
  text: '#1E242E',
  muted: '#EAEFF4',
  mutedForeground: '#626975',
  primary: '#42A056',
  primarySoft: 'rgba(66, 160, 86, 0.10)',
  primaryForeground: '#FBFDF5',
  accent: '#F7BD40',
  accentForeground: '#462D0B',
  sky: '#259CDE',
  win: '#1B9247',
  loss: '#DE3B3D',
  draw: '#626975',
  border: '#D9DFE5',
  boardLight: '#ECEDD7',
  boardDark: '#69945F',
  medalBronze: '#BD7138',
  medalSilver: '#A7AEBB',
  medalGold: '#EABF3A',
};

/** Radius scale from v0 (--radius 20px + steps). */
export const Radius = {
  lg: 20,
  xl: 26,
  '2xl': 34,
  '3xl': 44,
};

/** Rounded Baloo 2 for headings (h1/h2 only), Nunito for everything else. */
export const FontFamily = {
  heading: 'Baloo2_700Bold',
  headingExtra: 'Baloo2_800ExtraBold',
  body: 'Nunito_400Regular',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyExtra: 'Nunito_800ExtraBold',
};

const friendlyScheme = {
  text: Palette.text,
  background: Palette.background,
  tint: Palette.primary,
  icon: Palette.mutedForeground,
  tabIconDefault: Palette.mutedForeground,
  tabIconSelected: Palette.primary,
};

export const Colors = {
  light: friendlyScheme,
  dark: friendlyScheme,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
