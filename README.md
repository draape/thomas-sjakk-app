# Thomas-sjakk-app

A 12x12 chess variant mobile application built with Expo and React Native. This chess app features a custom game where Thomas (the human player) plays against various AI bots on an extended 12x12 board with Norwegian piece names and UI.

## Overview

Thomas-sjakk-app is a mobile chess game that implements a 12x12 variant of chess instead of the traditional 8x8 board. The game features:

- **Player vs Bot gameplay** - Human player (Thomas) always plays white, AI bots play black
- **12x12 board** - Extended chess board with columns a-l and rows 1-12
- **Norwegian language UI** - All game elements use Norwegian terminology
- **Trophy collection system** - Track victories against different AI bots
- **Rating system** - Player and bot ratings displayed during gameplay
- **Complete chess mechanics** - Pawn promotion, en passant, checkmate/stalemate detection

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npx expo start
   ```

3. **Run on specific platforms**
   ```bash
   npm run web        # Run in web browser (localhost:8081)
   npm run android    # Run on Android emulator
   npm run ios        # Run on iOS simulator
   ```

## Project Architecture

## Technology Stack

- **Framework**: Expo SDK 54 with React Native 0.81.4
- **Language**: TypeScript 5.9.2 with strict mode
- **Navigation**: Expo Router 6.0.8 with file-based routing
- **UI**: React Native StyleSheet with themed components
- **Assets**: SVG chess pieces, expo-image for rendering
- **State Management**: React hooks (useState, useCallback)
- **Styling**: Custom theme system with light/dark support
- **Linting**: ESLint 9.25.0 with Expo configuration
- **Build Tools**: Metro bundler with React Compiler (experimental)

## Development Commands

```bash
npm install        # Install dependencies
npm start          # Start Expo development server (expo start)
npm run web        # Run in web browser (expo start --web)
npm run android    # Run on Android emulator/device (expo start --android)
npm run ios        # Run on iOS simulator/device (expo start --ios)
npm run lint       # Run ESLint with Expo configuration
```

### Alternative Commands

```bash
npx expo start     # Direct Expo CLI usage
npx expo start --web --port 8081  # Specify web port
npx expo install   # Install Expo-compatible dependencies
```

## Development Notes

- TypeScript strict mode enabled with React 19.1.0
- ESLint configured with Expo standards
- Path aliases: `@/*` maps to project root (configured in tsconfig.json)
- Norwegian language used throughout UI and documentation
- Custom chess implementation (no external chess libraries)
- Haptic feedback integration for mobile experience via expo-haptics
- All game logic self-contained within the project
- React Compiler experimental features enabled
- Edge-to-edge rendering enabled on Android
- Automatic UI style switching (light/dark mode support)
- Tab-based navigation with typed routes

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- For iOS development: **Xcode** (macOS only)
- For Android development: **Android Studio** with Android SDK

## Troubleshooting

### Common Issues

**Expo CLI not found**

```bash
npm install -g @expo/cli
npx expo --version  # Verify installation
```

**Metro bundler issues**

```bash
npx expo start --clear  # Clear Metro cache
```

**TypeScript errors**

```bash
npm run lint  # Check for linting issues
npx tsc --noEmit  # Check TypeScript compilation
```

**Port conflicts**

```bash
npx expo start --web --port 3000  # Use different port
```

### Development Environment Setup

1. **Install Expo Development Build** on your mobile device from app stores
2. **Enable Developer Mode** on Android devices
3. **Connect to same Wi-Fi network** as your development machine
4. **Scan QR code** from Expo CLI to run on physical devices

### Performance Notes

- The web version runs on `http://localhost:8081` by default
- Hot reloading is enabled for faster development iterations
- SVG assets are optimized for both web and mobile platforms
- Game logic is optimized for 12x12 board calculations
