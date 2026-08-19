import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';

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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 21, 0.45)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
  },
  cancel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
