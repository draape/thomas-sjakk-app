import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GameOverModal } from "@/components/game-over-modal";
import { BotSelectionModal } from "@/components/bot-selection-modal";
import { ThemedText } from "@/components/themed-text";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { PlayerInfo } from "@/components/chess/PlayerInfo";
import { FontFamily, Palette, Radius } from "@/constants/theme";
import { useGameHistory } from "@/hooks/use-game-history";

import {
  BoardState,
  PieceColor,
  GameStatus,
  LastMove,
  PlayerInfo as PlayerInfoType,
} from "@/lib/chess/types";
import {
  createInitialBoard,
  calculateLegalMoves,
  checkGameStatus,
} from "@/lib/chess/game";
import { makeBotMove, BotDifficulty } from "@/lib/chess/ai";
import { BOT_CONFIG } from "@/lib/chess/bots";
import { positionToKey, keyToPosition } from "@/lib/chess/utils";
import { BOARD_SIZE } from "@/lib/chess/constants";

type MciName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const SIM_OPTIONS: {
  result: "win" | "draw" | "loss";
  label: string;
  icon: MciName;
  color: string;
  border: string;
}[] = [
  { result: "win", label: "Seier", icon: "trophy", color: Palette.win, border: "rgba(27, 146, 71, 0.4)" },
  { result: "draw", label: "Uavgjort", icon: "handshake", color: Palette.mutedForeground, border: Palette.border },
  { result: "loss", label: "Tap", icon: "heart-broken", color: Palette.loss, border: "rgba(222, 59, 61, 0.4)" },
];

// Player info - Thomas (player) is always at the bottom, opponent (bot) at the top
const player: PlayerInfoType = {
  name: "Thomas",
  rating: 1450,
  color: "Hvit",
  avatar: require("@/assets/images/thomas.jpg"),
};

export default function ChessBoardScreen() {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [attackedSquares, setAttackedSquares] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("ongoing");
  const [opponentDifficulty, setOpponentDifficulty] =
    useState<BotDifficulty>("easy");
  const [isBotSelectionVisible, setIsBotSelectionVisible] = useState(true);
  // For manual testing: forces the game-over screen without playing a real game.
  const [simulatedResult, setSimulatedResult] = useState<
    "win" | "loss" | "draw" | null
  >(null);

  const router = useRouter();
  const isFocused = useIsFocused();
  const { addGame } = useGameHistory();
  const gameInstanceIdRef = useRef(0);
  const recordedGameRef = useRef<number | null>(null);
  // True while a bot has been picked and the player is in a game (or its
  // game-over screen). Lets us reopen bot selection on focus only when there is
  // no game to return to.
  const gameActiveRef = useRef(false);

  const opponent = useMemo(
    () => BOT_CONFIG[opponentDifficulty].info,
    [opponentDifficulty]
  );
  const opponentBadgeKind = BOT_CONFIG[opponentDifficulty].badgeKind;

  const resetBoardState = useCallback(() => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setLegalMoves([]);
    setAttackedSquares([]);
    setCurrentPlayer("white");
    setLastMove(null);
    setGameStatus("ongoing");
    gameInstanceIdRef.current += 1;
    recordedGameRef.current = null;
  }, []);

  const startGameWithDifficulty = useCallback(
    (difficulty: BotDifficulty) => {
      setOpponentDifficulty(difficulty);
      resetBoardState();
      setSimulatedResult(null);
      gameActiveRef.current = true;
      setIsBotSelectionVisible(false);
    },
    [resetBoardState]
  );

  // Reopen bot selection when returning to the board with no game in progress
  // (e.g. after pressing "Hjem"). Deferring to focus avoids the picker flashing
  // over the home screen during the tab transition.
  useFocusEffect(
    useCallback(() => {
      if (!gameActiveRef.current) {
        setIsBotSelectionVisible(true);
      }
    }, [])
  );

  // Bot makes a move
  const executeBotMove = useCallback(() => {
    const botColor: PieceColor = "black";
    const botMoveResult = makeBotMove(
      board,
      botColor,
      lastMove,
      opponentDifficulty
    );

    if (!botMoveResult) return;

    const newBoard = { ...board };
    const movingPiece = newBoard[botMoveResult.from];
    const { row: sourceRow, col: sourceCol } = keyToPosition(botMoveResult.from);
    const { row: destRow, col: destCol } = keyToPosition(botMoveResult.to);

    const movedTwoSquares =
      movingPiece.type === "bonde" && Math.abs(destRow - sourceRow) === 2;

    // Handle en passant capture
    if (
      movingPiece.type === "bonde" &&
      Math.abs(destCol - sourceCol) === 1 &&
      !board[botMoveResult.to]
    ) {
      const capturedPawnKey = positionToKey(sourceRow, destCol);
      delete newBoard[capturedPawnKey];
    }

    // Handle pawn promotion
    let finalPiece = { ...movingPiece, hasMoved: true };
    if (movingPiece.type === "bonde") {
      const gameRow = BOARD_SIZE - destRow;
      if (
        (movingPiece.color === "white" && gameRow === 12) ||
        (movingPiece.color === "black" && gameRow === 1)
      ) {
        finalPiece = { ...finalPiece, type: "dronning" };
      }
    }

    newBoard[botMoveResult.to] = finalPiece;
    delete newBoard[botMoveResult.from];

    setBoard(newBoard);
    const newLastMove: LastMove = {
      from: botMoveResult.from,
      to: botMoveResult.to,
      movedTwoSquares,
    };
    setLastMove(newLastMove);

    const status = checkGameStatus(newBoard, "white", newLastMove);
    setGameStatus(status);
    setCurrentPlayer("white");
  }, [board, lastMove, opponentDifficulty]);

  // Trigger bot move when it's bot's turn
  useEffect(() => {
    if (currentPlayer === "black" && !isBotSelectionVisible) {
      const timeout = setTimeout(() => {
        executeBotMove();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, executeBotMove, isBotSelectionVisible]);

  useEffect(() => {
    if (gameStatus === "ongoing" || isBotSelectionVisible) return;
    const gameId = gameInstanceIdRef.current;
    if (recordedGameRef.current === gameId) return;

    let result: "win" | "loss" | "draw";
    if (gameStatus === "stalemate") {
      result = "draw";
    } else if (gameStatus === "checkmate") {
      result = currentPlayer === "white" ? "loss" : "win";
    } else {
      return;
    }

    recordedGameRef.current = gameId;
    const cfg = BOT_CONFIG[opponentDifficulty];
    addGame({
      opponentDifficulty,
      opponentName: cfg.info.name,
      opponentRating: cfg.info.rating,
      result,
    });
  }, [
    gameStatus,
    isBotSelectionVisible,
    currentPlayer,
    opponentDifficulty,
    addGame,
  ]);

  const handleNewGame = useCallback(() => {
    resetBoardState();
    setSimulatedResult(null);
    gameActiveRef.current = false;
    setIsBotSelectionVisible(true);
  }, [resetBoardState]);

  const handleGoHome = useCallback(() => {
    resetBoardState();
    setSimulatedResult(null);
    gameActiveRef.current = false;
    // Keep the picker hidden during the transition; the focus effect reopens it
    // when the player returns to the board.
    setIsBotSelectionVisible(false);
    router.navigate("/");
  }, [resetBoardState, router]);

  const handleSquarePress = (row: number, col: number) => {
    if (isBotSelectionVisible) return;

    const key = positionToKey(row, col);
    const piece = board[key];

    // If clicking on a legal move, move the piece
    if (selectedSquare && legalMoves.includes(key)) {
      const newBoard = { ...board };
      const movingPiece = newBoard[selectedSquare];
      const { row: sourceRow, col: sourceCol } = keyToPosition(selectedSquare);
      const { row: destRow, col: destCol } = keyToPosition(key);

      const movedTwoSquares =
        movingPiece.type === "bonde" && Math.abs(destRow - sourceRow) === 2;

      // Handle en passant capture
      if (
        movingPiece.type === "bonde" &&
        Math.abs(destCol - sourceCol) === 1 &&
        !board[key]
      ) {
        const capturedPawnKey = positionToKey(sourceRow, destCol);
        delete newBoard[capturedPawnKey];
      }

      // Handle pawn promotion
      let finalPiece = { ...movingPiece, hasMoved: true };
      if (movingPiece.type === "bonde") {
        const gameRow = BOARD_SIZE - destRow;
        if (
          (movingPiece.color === "white" && gameRow === 12) ||
          (movingPiece.color === "black" && gameRow === 1)
        ) {
          finalPiece = { ...finalPiece, type: "dronning" };
        }
      }

      newBoard[key] = finalPiece;
      delete newBoard[selectedSquare];

      setBoard(newBoard);
      setSelectedSquare(null);
      setLegalMoves([]);
      setAttackedSquares([]);
      
      const newLastMove: LastMove = { 
        from: selectedSquare, 
        to: key, 
        movedTwoSquares 
      };
      setLastMove(newLastMove);

      const status = checkGameStatus(newBoard, "black", newLastMove);
      setGameStatus(status);
      setCurrentPlayer("black");
    }
    // If clicking on own piece, select it
    else if (piece && piece.color === currentPlayer) {
      setSelectedSquare(key);
      const moves = calculateLegalMoves(board, key, lastMove);
      setLegalMoves(moves);

      // If it's a king, also calculate which squares are under attack
      if (piece.type === "konge") {
        const { row, col } = keyToPosition(key);
        const attacked: string[] = [];

        const directions = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1],
        ];

        for (const [dRow, dCol] of directions) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (
            newRow >= 0 &&
            newRow < BOARD_SIZE &&
            newCol >= 0 &&
            newCol < BOARD_SIZE
          ) {
            const targetKey = positionToKey(newRow, newCol);
            const targetPiece = board[targetKey];

            if (
              (!targetPiece || targetPiece.color !== piece.color) &&
              !moves.includes(targetKey)
            ) {
              attacked.push(targetKey);
            }
          }
        }
        setAttackedSquares(attacked);
      } else {
        setAttackedSquares([]);
      }
    }
    // If clicking elsewhere, deselect
    else {
      setSelectedSquare(null);
      setLegalMoves([]);
      setAttackedSquares([]);
    }
  };

  // Determine game result from player's perspective
  const getGameResult = (): "win" | "loss" | "draw" | null => {
    if (gameStatus === "ongoing") return null;
    if (gameStatus === "stalemate") return "draw";

    if (currentPlayer === "white") {
      return "loss";
    } else {
      return "win";
    }
  };

  const gameResult = simulatedResult ?? getGameResult();
  const showGameOver =
    gameResult !== null && !isBotSelectionVisible && isFocused;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Sjakkbrett
          </ThemedText>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={handleNewGame}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={20} color={Palette.primaryForeground} />
            <ThemedText style={styles.newGameButtonText}>Nytt spill</ThemedText>
          </TouchableOpacity>
        </View>

        <PlayerInfo player={opponent} badgeKind={opponentBadgeKind} />

        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          attackedSquares={attackedSquares}
          onSquarePress={handleSquarePress}
        />

        <PlayerInfo player={player} />

        {!isBotSelectionVisible && (
          <View style={styles.simSection}>
            <ThemedText style={styles.simLabel}>Simuler slutt</ThemedText>
            <View style={styles.simGrid}>
              {SIM_OPTIONS.map(({ result, label, icon, color, border }) => (
                <TouchableOpacity
                  key={result}
                  style={[styles.simButton, { borderColor: border }]}
                  onPress={() => setSimulatedResult(result)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name={icon} size={24} color={color} />
                  <ThemedText style={[styles.simButtonText, { color }]}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <GameOverModal
        visible={showGameOver}
        result={gameResult || "draw"}
        onNewGame={handleNewGame}
        onGoHome={handleGoHome}
      />
      <BotSelectionModal
        visible={isBotSelectionVisible && isFocused}
        onSelect={startGameWithDifficulty}
        onClose={() => setIsBotSelectionVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    color: Palette.text,
  },
  newGameButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: Radius["2xl"],
    backgroundColor: Palette.primary,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  newGameButtonText: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 16,
    color: Palette.primaryForeground,
  },
  simSection: {
    gap: 8,
  },
  simLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 14,
    color: Palette.mutedForeground,
  },
  simGrid: {
    flexDirection: "row",
    gap: 8,
  },
  simButton: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: Radius["2xl"],
    borderWidth: 2,
    backgroundColor: Palette.card,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  simButtonText: {
    fontFamily: FontFamily.bodyExtra,
    fontSize: 15,
  },
});
