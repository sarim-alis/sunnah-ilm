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
import type { ThemeColors } from '@/constants/colors';
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
  }, [visible, preferences]);

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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(21, 21, 21, 0.45)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    maxHeight: '84%',
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerSide: {
    alignItems: 'flex-end',
    width: 32,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  count: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    maxHeight: 420,
  },
  bodyContent: {
    paddingBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  chip: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '48.5%',
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipOff: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  chipMaxed: {
    opacity: 0.45,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextOn: {
    color: colors.onPrimary,
  },
  chipTextOff: {
    color: colors.text,
  },
  chipTextMaxed: {
    color: colors.textMuted,
  },
  chipRemove: {
    marginLeft: 6,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 48,
  },
  saveText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
