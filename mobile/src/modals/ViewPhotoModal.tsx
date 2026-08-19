import { Image, Modal, Pressable, StyleSheet } from 'react-native';

type ViewPhotoModalProps = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
};

export function ViewPhotoModal({ visible, uri, onClose }: ViewPhotoModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {uri ? <Image source={{ uri }} style={styles.image} resizeMode="contain" /> : null}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 21, 0.88)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    borderRadius: 16,
    height: '70%',
    width: '100%',
  },
});
