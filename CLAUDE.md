# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Thomas-sjakk-app", a 12x12 chess variant mobile application built with Expo and React Native. The app features a custom chess game where Thomas (human player) plays against various AI bots.

## Key Development Commands

- `npm install` - Install dependencies
- `npx expo start` - Start development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint (using expo lint configuration)
- `npm run reset-project` - Reset to blank starter template

## Architecture Overview

### File Structure

- `app/` - Main application code using Expo Router file-based routing
  - `(tabs)/` - Tab navigation screens (home, game board)
  - `_layout.tsx` - Root layout with theme provider and stack navigation
- `components/` - Reusable UI components including game-specific components
- `assets/` - Images and SVG chess pieces (separate white/black piece sets)
- `spec/` - Game rules documentation in Norwegian
- `constants/` - Theme and styling constants
- `hooks/` - Custom React hooks for color scheme management

### Game Logic Architecture

The chess game logic is implemented entirely in `app/(tabs)/explore.tsx` as a single-file solution:

- **Board Representation**: 12x12 grid using string keys (e.g., "a1", "g12")
- **Piece System**: Interface-based with type/color properties and SVG rendering
- **Move Calculation**: Separate functions per piece type with legal move validation
- **Game State**: React state managing board, selected squares, current player, game status
- **AI Bot**: Simple random move selection for opponent

### Key Game Rules (12x12 Variant)

- Board: 12 columns (a-l) × 12 rows (1-12)
- White pieces start on rows 1-2 (bottom), black on rows 11-12 (top)
- Player always plays white (bottom), bot plays black (top)
- Standard chess rules with pawn promotion, en passant, checkmate/stalemate detection
- King positions: white g1, black g12
- Rook positions: a1/k1 (white), a12/k12 (black)

### UI Patterns

- Uses themed components (`ThemedText`, `ThemedView`) for consistent styling
- Expo Image component for SVG chess pieces and avatars
- Modal system for game over states with result-specific messaging
- Tab navigation between home screen (trophies/rating) and game board
- Haptic feedback integration for enhanced mobile experience

### Technology Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router with tab navigation
- **Styling**: StyleSheet with responsive design
- **Assets**: SVG chess pieces, themed color system
- **State Management**: React hooks (no external state library)

## Development Notes

- TypeScript enabled with strict mode
- ESLint configured with Expo standards
- Path aliases configured: `@/*` maps to project root
- No external chess libraries - custom implementation
- Norwegian language used in UI and documentation
- All game logic contained in single explore.tsx file for simplicity
