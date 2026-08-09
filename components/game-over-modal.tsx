import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { BotDifficulty } from '@/lib/chess/ai';

type GameResult = 'win' | 'loss' | 'draw';

interface GameOverModalProps {
  visible: boolean;
  result: GameResult;
  onNewGame: () => void;
  onGoHome: () => void;
  opponentDifficulty?: BotDifficulty;
}

export function GameOverModal({
  visible,
  result,
  onNewGame,
  onGoHome,
  opponentDifficulty = 'easy',
}: GameOverModalProps) {
  const getMedalEmoji = () => {
    switch (opponentDifficulty) {
      case 'easy':
        return '🥉'; // Bronze
      case 'medium':
        return '🥈'; // Silver
      case 'hard':
        return '🥇'; // Gold
      case 'pro':
        return '🏆'; // Trophy
      case 'super':
        return '💎'; // Diamond
      default:
        return '🥉';
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return 'Du vant!';
      case 'draw':
        return 'Bra jobbet!';
      case 'loss':
        return 'Greit, men ikke bra nok!';
    }
  };

  const getSubtitle = () => {
    switch (result) {
      case 'draw':
        return 'Uavgjort - Sjakk patt';
      case 'loss':
        return 'Sjakk matt';
      default:
        return null;
    }
  };

  const subtitle = getSubtitle();

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onGoHome}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.resultContainer}>
          {result === 'win' && (
            <ThemedText style={styles.medalEmoji}>{getMedalEmoji()}</ThemedText>
          )}
          <ThemedText type="title" style={styles.resultText}>
            {getResultMessage()}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={onNewGame}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.newGameButtonText}>Nytt spill</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={onGoHome}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.homeButtonText}>Hjem</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  medalEmoji: {
    fontSize: 120,
    lineHeight: 140,
    height: 140,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  homeButtonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
