import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/modals/EditPreferencesModal';
import { useTheme } from '@/theme/ThemeProvider';
import {
  HADITH_TOPICS,
  MAX_PREFERENCE_TOPICS,
  uniqueTopicNames,
} from '@/users/preferences';
import type { HadithTopic, UserPreference } from '@/users/preferences';

type EditPreferencesModalProps = {
  visible: boolean;
  preferences?: UserPreference[] | null;
  saving: boolean;
  onClose: () => void;
  onSave: (topics: HadithTopic[]) => void;
};

export function EditPreferencesModal({
  visible,
  preferences,
  saving,
  onClose,
  onSave,
}: EditPreferencesModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [topics, setTopics] = useState<HadithTopic[]>(
    uniqueTopicNames(preferences),
  );

  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTopics(uniqueTopicNames(preferences));
    setError('');
  }, [visible]);

  const close = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = () => {
    const next = (topics ?? []).slice(0, MAX_PREFERENCE_TOPICS);
    setError('');
    onSave(next);
  };

  const toggleTopic = (topic: HadithTopic) => {
    const current = topics ?? [];
    if (current.includes(topic)) {
      setError('');
      setTopics(current.filter((item) => item !== topic));
      return;
    }
    if (current.length >= MAX_PREFERENCE_TOPICS) {
      setError(`You cannot pick more than ${MAX_PREFERENCE_TOPICS} topics`);
      return;
    }
    setError('');
    setTopics([...current, topic]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <Text style={styles.title}>Topics</Text>
            <TouchableOpacity
              onPress={close}
              disabled={saving}
              style={styles.headerSide}
              hitSlop={8}
              accessibilityLabel="Close"
            >
              <Ionicons name="close" size={28} color={colors.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Pick upto {MAX_PREFERENCE_TOPICS} topics</Text>
          <Text style={styles.count}>
            {(topics ?? []).length} / {MAX_PREFERENCE_TOPICS}
          </Text>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chips}>
              {HADITH_TOPICS.map((topic) => {
                const selected = (topics ?? []).includes(topic);
                const maxed =
                  !selected && (topics ?? []).length >= MAX_PREFERENCE_TOPICS;
                return (
                  <TouchableOpacity
                    key={topic}
                    onPress={() => toggleTopic(topic)}
                    activeOpacity={0.85}
                    style={[
                      styles.chip,
                      selected ? styles.chipOn : styles.chipOff,
                      maxed ? styles.chipMaxed : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected ? styles.chipTextOn : styles.chipTextOff,
                        maxed ? styles.chipTextMaxed : null,
                      ]}
                    >
                      {topic}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="close"
                        size={14}
                        color={colors.onPrimary}
                        style={styles.chipRemove}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
