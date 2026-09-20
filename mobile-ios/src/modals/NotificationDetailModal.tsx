import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/modals/NotificationDetailModal';
import { useTheme } from '@/theme/ThemeProvider';

export type NotificationDetail = {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

type NotificationDetailModalProps = {
  visible: boolean;
  notification: NotificationDetail | null;
  iconColor: string;
  iconBackground: string;
  onClose: () => void;
  onSetUnread: (id: string, unread: boolean) => void;
};

export function NotificationDetailModal({
  visible,
  notification,
  iconColor,
  iconBackground,
  onClose,
  onSetUnread,
}: NotificationDetailModalProps) {
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
        {notification ? (
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerSide} />
              <Text style={styles.title}>{notification.title}</Text>
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
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.description}>{notification.description}</Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => onSetUnread(notification.id, !notification.unread)}
              style={[
                styles.markButton,
                notification.unread ? null : styles.markButtonUnread,
              ]}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.markText,
                  notification.unread ? null : styles.markTextUnread,
                ]}
              >
                {notification.unread ? 'Mark as read' : 'Mark as unread'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
