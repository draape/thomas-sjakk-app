# Repository Guidelines

## Project Structure & Module Organization

Source screens live in `app/` with Expo Router tabs under `app/(tabs)/`; shared presentation components are in `components/` while chess-specific UI sits inside `components/chess/`. Core engine logic (rules, AI, helpers) is under `lib/chess/` with per-piece implementations in `lib/chess/pieces/`. Media assets (avatars, icons, SVG pieces) live in `assets/`, and specs or gameplay briefs are under `spec/` for reference when adjusting rules. Keep configuration in `app.json`, TypeScript settings in `tsconfig.json`, and lint rules within `eslint.config.js`.

## Build, Test, and Development Commands

- `npm start` — launch the Expo dev server; pair with Expo Go or a simulator.
- `npm run ios` / `npm run android` / `npm run web` — open the same bundle on the desired platform.
- `npm run lint` — run ESLint via Expo config; required before any PR.
- `npx expo start --clear` — clear Metro cache when assets or routing changes behave oddly.

## Coding Style & Naming Conventions

Use TypeScript with strict typing enabled; prefer typed hooks and explicit props. Follow 2-space indentation, PascalCase for components (`ChessBoard.tsx`), camelCase for hooks/utilities, and kebab-case for asset names. Keep Norwegian terminology in UI copy to match the rest of the app. Style components with React Native `StyleSheet` helpers or the themed wrappers already in `components/`. Run ESLint frequently; do not bypass warnings without justification.

## Testing Guidelines

Automated tests are not yet wired, so validate changes by running `npm start` and exercising both `(tabs)/index` and `explore` flows. When altering engine logic, add or update scenario notes under `spec/regler/` (e.g., describe new sword moves) and manually reproduce the scenario on the board. Record regressions or tricky setups in `spec/ui/` so others can replay them quickly.

## Commit & Pull Request Guidelines

Commit history uses `TYPE: Description` with uppercase short types (`FEAT`, `FIX`, `DOCS`). Keep messages in the imperative voice and scope each commit to a logical unit (UI tweak, rule change, etc.). Pull requests should list the affected areas, steps to reproduce/verify, any linked issue IDs, and platform screenshots or short screen recordings if UI changes are visible. Mention lingering TODOs explicitly so future agents can prioritize them.

## Assets & Configuration Tips

Place new SVGs under `assets/svg/{white,black}` using existing naming. Update `expo-env.d.ts` if you introduce modules requiring new globals, and register any new screens via file placement under `app/` so Expo Router picks them up automatically. When touching native permissions or icons, sync `app.json` and supply updated images in `assets/`.

## Verify new functionality

This is the fun part for our testers! All visual testing will be done manually. To verify the code output, always run `npm run lint`. No other verification is needed.
