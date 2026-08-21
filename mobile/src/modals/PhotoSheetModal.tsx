import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '@/styles/modals/PhotoSheetModal';
import { useTheme } from '@/theme/ThemeProvider';

type PhotoSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  onGallery: () => void;
  onCamera: () => void;
  onView: () => void;
};

export function PhotoSheetModal({
  visible,
  onClose,
  onGallery,
  onCamera,
  onView,
}: PhotoSheetModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <TouchableOpacity onPress={onGallery} style={styles.item}>
            <Text style={styles.itemText}>Upload from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCamera} style={styles.item}>
            <Text style={styles.itemText}>Take photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onView} style={styles.item}>
            <Text style={styles.itemText}>View current</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity onPress={onClose} style={styles.item}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
