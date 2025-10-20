# Thomas-sjakk-app

A 12x12 chess variant mobile application built with Expo and React Native. Thomas (the human player) plays against AI bots on an extended 12x12 board with Norwegian piece names and UI.

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
   npm run web        # Run in web browser
   npm run android    # Run on Android emulator
   npm run ios        # Run on iOS simulator
   ```

## Game Features

- **12x12 board** - Extended chess board with columns a-l and rows 1-12
- **Player vs Bot** - Human player (Thomas) plays white, AI bots play black
- **Norwegian terminology** - All piece names and UI elements in Norwegian
- **Complete chess rules** - Pawn promotion, en passant, checkmate/stalemate detection
- **Rating system** - Display player and bot ratings during gameplay
- **Haptic feedback** - Enhanced mobile experience with tactile responses

## Project Structure

```
app/
├── (tabs)/               # Tab navigation screens
│   ├── index.tsx        # Home screen with trophies and rating
│   └── explore.tsx      # Main chess game screen
└── _layout.tsx          # Root layout with theme provider

components/
├── chess/               # Chess-specific UI components
│   ├── ChessBoard.tsx   # Game board rendering
│   ├── ChessPiece.tsx   # Individual piece components
│   ├── ChessSquare.tsx  # Board square components
│   └── PlayerInfo.tsx   # Player information display
└── themed-*.tsx         # Themed UI components

lib/chess/               # Game logic and chess engine
├── pieces/              # Individual piece movement logic
├── game.ts             # Board state and game rules
├── ai.ts               # Bot AI implementation
├── types.ts            # TypeScript interfaces
├── constants.ts        # Game constants and piece positions
└── utils.ts            # Helper functions

assets/
├── images/             # Player avatars and app icons
└── svg/               # Chess piece SVG assets (Norwegian names)
    ├── black/         # Black piece set
    └── white/         # White piece set
```

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

- **TypeScript**: Strict mode enabled with React 19.1.0
- **Linting**: ESLint configured with Expo standards
- **Path aliases**: `@/*` maps to project root (configured in tsconfig.json)
- **Language**: Norwegian terminology throughout UI and documentation
- **Chess engine**: Custom implementation with modular piece logic (no external libraries)
- **State management**: React hooks for game state and UI interactions
- **Navigation**: Expo Router with tab-based navigation and typed routes
- **Styling**: Custom theme system with light/dark mode support
- **Mobile features**: Haptic feedback integration via expo-haptics
- **Rendering**: Edge-to-edge rendering enabled on Android
- **Build tools**: React Compiler experimental features enabled

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
