import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type GameResult = 'win' | 'loss' | 'draw';

interface GameOverModalProps {
  visible: boolean;
  result: GameResult;
  onNewGame: () => void;
  opponentDifficulty?: 'easy' | 'medium' | 'hard';
}

export function GameOverModal({ visible, result, onNewGame, opponentDifficulty = 'easy' }: GameOverModalProps) {
  const getMedalEmoji = () => {
    if (result !== 'win') return '';

    switch (opponentDifficulty) {
      case 'easy':
        return '🥉'; // Bronze
      case 'medium':
        return '🥈'; // Silver
      case 'hard':
        return '🥇'; // Gold
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onNewGame}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.resultContainer}>
            {result === 'win' && (
              <ThemedText style={styles.medalEmoji}>{getMedalEmoji()}</ThemedText>
            )}
            <ThemedText type="title" style={styles.resultText}>
              {getResultMessage()}
            </ThemedText>
            {result === 'draw' && (
              <ThemedText style={styles.subtitle}>
                Uavgjort - Sjakk patt
              </ThemedText>
            )}
            {result === 'loss' && (
              <ThemedText style={styles.subtitle}>
                Sjakk matt
              </ThemedText>
            )}
          </View>

          <TouchableOpacity style={styles.newGameButton} onPress={onNewGame}>
            <ThemedText style={styles.newGameButtonText}>Nytt spill</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  medalEmoji: {
    fontSize: 80,
    lineHeight: 90,
    height: 90,
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
  newGameButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
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
});
