import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '@/styles/modals/AskHintsModal';
import { useTheme } from '@/theme/ThemeProvider';
import type { HadithTopic } from '@/users/preferences';

type AskHintsModalProps = {
  visible: boolean;
  topic: HadithTopic;
  hints: string[];
  onClose: () => void;
  onSelect: (hint: string) => void;
};

export function AskHintsModal({
  visible,
  topic,
  hints,
  onClose,
  onSelect,
}: AskHintsModalProps) {
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
          <Text style={styles.title}>Suggestions</Text>
          <Text style={styles.subtitle}>Tap a question about {topic}</Text>
          <View style={styles.hintList}>
            {hints.map((hint) => (
              <TouchableOpacity
                key={hint}
                onPress={() => onSelect(hint)}
                style={styles.hintItem}
                activeOpacity={0.85}
              >
                <Text style={styles.hintText}>{hint}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.85}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
