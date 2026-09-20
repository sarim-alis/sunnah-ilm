import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AddNotificationModal } from '@/modals/AddNotificationModal';
import { NotificationDetailModal } from '@/modals/NotificationDetailModal';
import {
  notificationGroup,
  notificationStyle,
  notificationTimeAgo,
  type NotificationGroup,
} from '@/notifications/format';
import {
  useCreateNotification,
  useMarkAllNotificationsRead,
  useNotifications,
  useSetNotificationRead,
} from '@/notifications/hooks';
import { errorMessage } from '@/services/auth';
import { createStyles } from '@/styles/screens/NotificationsScreen';
import { useTheme } from '@/theme/ThemeProvider';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'saved', label: 'Saved' },
  { key: 'alerts', label: 'Alerts' },
] as const;

const GROUPS: { key: NotificationGroup; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier', label: 'Earlier' },
];

type NotificationsScreenProps = {
  onBack: () => void;
};

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const listQuery = useNotifications();
  const createMutation = useCreateNotification();
  const setReadMutation = useSetNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  const accents = {
    green: '#22C55E',
    red: colors.error,
    blue: '#3B82F6',
    none: 'transparent',
  };

  const iconTints = {
    green: { backgroundColor: 'rgba(34, 197, 94, 0.14)', color: '#16A34A' },
    red: { backgroundColor: 'rgba(225, 29, 72, 0.12)', color: colors.error },
    blue: { backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#2563EB' },
    none: { backgroundColor: colors.accent, color: colors.primary },
  };

  const items = useMemo(() => {
    return (listQuery.data?.notifications ?? []).map((item) => {
      const look = notificationStyle(item.id);
      return {
        ...item,
        unread: !item.isRead,
        time: notificationTimeAgo(item.createdAt),
        group: notificationGroup(item.createdAt),
        accent: look.accent,
        icon: look.icon,
      };
    });
  }, [listQuery.data?.notifications]);

  const visible = items.filter((item) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery =
      !needle ||
      item.title.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle);
    return matchesQuery;
  });

  const hasUnread = items.some((item) => item.unread);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const setUnread = (id: string, unread: boolean) => {
    setReadMutation.mutate(
      { id, isRead: !unread },
      {
        onError: (err) => {
          Toast.show({
            type: 'error',
            text1: 'Update failed',
            text2: errorMessage(err, 'Could not update notification'),
          });
        },
      },
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.iconButton}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Stay updated with your activity</Text>
        </View>
        <TouchableOpacity
          onPress={() => setSearchOpen((open) => !open)}
          style={styles.iconButton}
          accessibilityLabel="Search notifications"
        >
          <Ionicons name="search-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {searchOpen ? (
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search notifications"
          placeholderTextColor={colors.textMuted}
          style={styles.searchBox}
          autoFocus
        />
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filterRow}
      >
        {FILTERS.map((item) => {
          const active = filter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.chip, active ? styles.chipOn : null]}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, active ? styles.chipTextOn : null]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {hasUnread ? (
        <View style={styles.markRow}>
          <TouchableOpacity
            onPress={() =>
              markAllMutation.mutate(undefined, {
                onError: (err) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Update failed',
                    text2: errorMessage(err, 'Could not mark all as read'),
                  });
                },
              })
            }
            style={styles.markButton}
            activeOpacity={0.85}
          >
            <Text style={styles.markText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {listQuery.isPending ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : listQuery.isError ? (
        <View style={styles.loading}>
          <Text style={styles.empty}>
            {errorMessage(listQuery.error, 'Could not load notifications')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              void listQuery.refetch();
            }}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {GROUPS.map((group) => {
            const groupItems = visible.filter((item) => item.group === group.key);
            if (group.key !== 'today' && !groupItems.length) return null;
            return (
              <View key={group.key} style={styles.section}>
                <View style={styles.sectionHead}>
                  <Text style={styles.sectionTitle}>{group.label}</Text>
                  {group.key === 'today' ? (
                    <TouchableOpacity
                      onPress={() => setAddOpen(true)}
                      style={styles.addButton}
                      accessibilityLabel="Add notification"
                    >
                      <Ionicons name="add" size={22} color={colors.onPrimary} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {groupItems.map((item) => {
                  const tint = iconTints[item.accent];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.cardShadow}
                      activeOpacity={0.85}
                      onPress={() => setSelectedId(item.id)}
                    >
                      <View style={styles.card}>
                        <View
                          style={[styles.rail, { backgroundColor: accents[item.accent] }]}
                        />
                        <View style={styles.cardBody}>
                          <View
                            style={[
                              styles.itemIcon,
                              { backgroundColor: tint.backgroundColor },
                            ]}
                          >
                            <Ionicons name={item.icon} size={20} color={tint.color} />
                          </View>
                          <View style={styles.itemCopy}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription} numberOfLines={2}>
                              {item.description}
                            </Text>
                          </View>
                          <View style={styles.itemMeta}>
                            <Text
                              style={[
                                styles.itemStatus,
                                item.unread
                                  ? styles.itemStatusUnread
                                  : styles.itemStatusRead,
                              ]}
                            >
                              {item.unread ? 'Unread' : 'Read'}
                            </Text>
                            <Text style={styles.itemTime}>{item.time}</Text>
                            {item.unread ? <View style={styles.unreadDot} /> : null}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {visible.length === 0 && group.key === 'today' ? (
                  <Text style={styles.empty}>No notifications yet</Text>
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      )}

      <NotificationDetailModal
        visible={Boolean(selected)}
        notification={selected}
        iconColor={selected ? iconTints[selected.accent].color : colors.primary}
        iconBackground={
          selected ? iconTints[selected.accent].backgroundColor : colors.accent
        }
        onClose={() => setSelectedId(null)}
        onSetUnread={setUnread}
      />

      <AddNotificationModal
        visible={addOpen}
        saving={createMutation.isPending}
        onClose={() => setAddOpen(false)}
        onSave={(data) => {
          createMutation.mutate(data, {
            onSuccess: () => {
              setAddOpen(false);
              Toast.show({ type: 'success', text1: 'Added', text2: 'Notification saved' });
            },
            onError: (err) => {
              Toast.show({
                type: 'error',
                text1: 'Add failed',
                text2: errorMessage(err, 'Could not add notification'),
              });
            },
          });
        }}
      />
    </View>
  );
}
