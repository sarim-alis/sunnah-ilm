import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/modals/AddNotificationModal';
import { useTheme } from '@/theme/ThemeProvider';

type AddNotificationModalProps = {
  visible: boolean;
  saving: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
};

export function AddNotificationModal({
  visible,
  saving,
  onClose,
  onSave,
}: AddNotificationModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTitle('');
    setDescription('');
    setError('');
  }, [visible]);

  const close = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }
    setError('');
    onSave({ title: title.trim(), description: description.trim() });
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoid}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerSide} />
              <Text style={styles.title}>Add notification</Text>
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

            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Notification title"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Write the full notification"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.area]}
              multiline
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
