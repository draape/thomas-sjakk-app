import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import { GameOverModal } from "@/components/game-over-modal";
import { BotSelectionModal } from "@/components/bot-selection-modal";
import { ThemedText } from "@/components/themed-text";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { PlayerInfo } from "@/components/chess/PlayerInfo";

import { 
  BoardState, 
  PieceColor, 
  GameStatus, 
  LastMove,
  PlayerInfo as PlayerInfoType 
} from "@/lib/chess/types";
import { 
  createInitialBoard, 
  calculateLegalMoves, 
  checkGameStatus
} from "@/lib/chess/game";
import { makeBotMove, BotDifficulty } from "@/lib/chess/ai";
import { positionToKey, keyToPosition } from "@/lib/chess/utils";
import { BOARD_SIZE } from "@/lib/chess/constants";

// Player info - Thomas (player) is always at the bottom, opponent (bot) at the top
const player: PlayerInfoType = {
  name: "Thomas",
  rating: 1450,
  color: "Hvit",
  avatar: require("@/assets/images/thomas.jpg"),
};

const BOT_CONFIG: Record<
  BotDifficulty,
  { info: PlayerInfoType; description: string; badge: string }
> = {
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

  const opponent = useMemo(
    () => BOT_CONFIG[opponentDifficulty].info,
    [opponentDifficulty]
  );

  const botSelectionOptions = useMemo(
    () =>
      Object.entries(BOT_CONFIG).map(([difficulty, config]) => ({
        difficulty: difficulty as BotDifficulty,
        title: config.info.name,
        description: config.description,
        badge: config.badge,
      })),
    []
  );

  const resetBoardState = useCallback(() => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setLegalMoves([]);
    setAttackedSquares([]);
    setCurrentPlayer("white");
    setLastMove(null);
    setGameStatus("ongoing");
  }, []);

  const startGameWithDifficulty = useCallback(
    (difficulty: BotDifficulty) => {
      setOpponentDifficulty(difficulty);
      resetBoardState();
      setIsBotSelectionVisible(false);
    },
    [resetBoardState]
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

  const handleNewGame = () => {
    setGameStatus("ongoing");
    setIsBotSelectionVisible(true);
  };

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

  const gameResult = getGameResult();
  const showGameOver = gameResult !== null && !isBotSelectionVisible;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Sjakkbrett
        </ThemedText>
        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <ThemedText style={styles.newGameButtonText}>Nytt spill</ThemedText>
        </TouchableOpacity>
      </View>

      <PlayerInfo player={opponent} />

      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        attackedSquares={attackedSquares}
        onSquarePress={handleSquarePress}
      />

      <PlayerInfo player={player} />

      <GameOverModal
        visible={showGameOver}
        result={gameResult || "draw"}
        onNewGame={handleNewGame}
        opponentDifficulty={opponentDifficulty}
      />
      <BotSelectionModal
        visible={isBotSelectionVisible}
        options={botSelectionOptions}
        onSelect={startGameWithDifficulty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
  },
  newGameButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newGameButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
