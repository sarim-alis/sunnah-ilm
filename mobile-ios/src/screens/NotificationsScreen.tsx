import { useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationDetailModal } from '@/modals/NotificationDetailModal';
import { createStyles } from '@/styles/screens/NotificationsScreen';
import { useTheme } from '@/theme/ThemeProvider';

type FilterKey = 'all' | 'daily' | 'saved' | 'alerts';
type GroupKey = 'today' | 'yesterday' | 'earlier';
type AccentKey = 'green' | 'red' | 'blue' | 'none';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  group: GroupKey;
  category: Exclude<FilterKey, 'all'>;
  icon: keyof typeof Ionicons.glyphMap;
  accent: AccentKey;
  unread: boolean;
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'saved', label: 'Saved' },
  { key: 'alerts', label: 'Alerts' },
];

const GROUPS: { key: GroupKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier', label: 'Earlier' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Hadith of the Day',
    description:
      'Today’s narration is ready. Open it and reflect on the Sunnah — a short authentic hadith chosen for this day, with its source and meaning so you can read it in full and carry one teaching with you.',
    time: '2h ago',
    group: 'today',
    category: 'daily',
    icon: 'checkmark',
    accent: 'green',
    unread: true,
  },
  {
    id: '2',
    title: 'Ask a question',
    description:
      'Have you asked a Hadith today? Seek knowledge from authentic sources. Type a question in Ask Hadith and Sunnah Ilm will retrieve narrations with their books, numbers, and topics.',
    time: '3h ago',
    group: 'today',
    category: 'alerts',
    icon: 'time-outline',
    accent: 'red',
    unread: true,
  },
  {
    id: '3',
    title: 'Saved for later',
    description:
      'A hadith you bookmarked is waiting for you to read again. Open Saved to return to the narration, review its wording, and keep it close for later reflection.',
    time: '5h ago',
    group: 'today',
    category: 'saved',
    icon: 'trending-up-outline',
    accent: 'blue',
    unread: true,
  },
  {
    id: '4',
    title: 'Welcome to Sunnah Ilm',
    description:
      'Your journey of learning the Prophet’s teachings starts here. Finish setting up your profile, pick the topics you care about, and begin with one authentic hadith at a time.',
    time: '1d ago',
    group: 'yesterday',
    category: 'alerts',
    icon: 'person-outline',
    accent: 'none',
    unread: false,
  },
  {
    id: '5',
    title: 'Explore topics',
    description:
      'Browse Faith, Prayer, Character, and more authentic collections. Filter by topic to find narrations that match what you want to study today.',
    time: '1d ago',
    group: 'yesterday',
    category: 'alerts',
    icon: 'notifications-outline',
    accent: 'none',
    unread: false,
  },
  {
    id: '6',
    title: 'Keep seeking knowledge',
    description:
      'Even one hadith a day brings barakah to the heart. Come back tomorrow for a new narration, or reopen today’s hadith and sit with its meaning a little longer.',
    time: '3d ago',
    group: 'earlier',
    category: 'daily',
    icon: 'checkmark',
    accent: 'none',
    unread: false,
  },
];

type NotificationsScreenProps = {
  onBack: () => void;
};

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const visible = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const needle = query.trim().toLowerCase();
    const matchesQuery =
      !needle ||
      item.title.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle);
    return matchesFilter && matchesQuery;
  });

  const hasUnread = items.some((item) => item.unread);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const setUnread = (id: string, unread: boolean) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread } : item)),
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
              setItems((current) => current.map((item) => ({ ...item, unread: false })))
            }
            style={styles.markButton}
            activeOpacity={0.85}
          >
            <Text style={styles.markText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {visible.length ? (
          GROUPS.map((group) => {
            const groupItems = visible.filter((item) => item.group === group.key);
            if (!groupItems.length) return null;
            return (
              <View key={group.key} style={styles.section}>
                <Text style={styles.sectionTitle}>{group.label}</Text>
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
              </View>
            );
          })
        ) : (
          <Text style={styles.empty}>No notifications yet</Text>
        )}
      </ScrollView>

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
    </View>
  );
}
