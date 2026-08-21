import { Image, Modal, Pressable } from 'react-native';
import { styles } from '@/styles/modals/ViewPhotoModal';

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
