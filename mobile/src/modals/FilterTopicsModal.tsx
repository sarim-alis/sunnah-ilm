import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/modals/FilterTopicsModal';
import { useTheme } from '@/theme/ThemeProvider';
import { HADITH_TOPICS } from '@/users/preferences';
import type { HadithTopic } from '@/users/preferences';

type FilterTopicsModalProps = {
  visible: boolean;
  selected?: string;
  onClose: () => void;
  onSelect: (topic: HadithTopic) => void;
};

export function FilterTopicsModal({
  visible,
  selected,
  onClose,
  onSelect,
}: FilterTopicsModalProps) {
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
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <Text style={styles.title}>Topics</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.headerSide}
              hitSlop={8}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={28} color={colors.error} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chips}>
              {HADITH_TOPICS.map((topic) => {
                const active = selected === topic;
                return (
                  <TouchableOpacity
                    key={topic}
                    onPress={() => onSelect(topic)}
                    activeOpacity={0.85}
                    style={[styles.chip, active ? styles.chipOn : null]}
                  >
                    <Text style={[styles.chipText, active ? styles.chipTextOn : null]}>
                      {topic}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
