import { useMemo } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '@/styles/modals/LogoutModal';
import { useTheme } from '@/theme/ThemeProvider';

type DeleteAccountModalProps = {
  visible: boolean;
  confirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteAccountModal({
  visible,
  confirming = false,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
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
          <Text style={styles.title}>Delete account</Text>
          <Text style={styles.message}>
            This permanently removes your name, email, password, profile photo,
            topic preferences, and saved Ahadees from Sunnah-Ilm. You cannot undo
            this.
          </Text>
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
              style={[styles.button, styles.destructiveButton]}
              activeOpacity={0.85}
            >
              {confirming ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.confirmText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
