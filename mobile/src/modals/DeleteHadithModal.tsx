import { useMemo } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '@/styles/modals/LogoutModal';
import { useTheme } from '@/theme/ThemeProvider';

type DeleteHadithModalProps = {
  visible: boolean;
  confirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteHadithModal({
  visible,
  confirming = false,
  onClose,
  onConfirm,
}: DeleteHadithModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Hadith</Text>
          <Text style={styles.message}>Are you sure you want to delete this Hadith?</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              disabled={confirming}
              style={[styles.button, styles.cancelButton]}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={confirming}
              style={[styles.button, styles.confirmButton]}
              activeOpacity={0.85}
            >
              {confirming ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.confirmText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
