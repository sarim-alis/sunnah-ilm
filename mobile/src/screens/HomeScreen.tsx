import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import type { AuthUser } from '@/services/auth';

type HomeScreenProps = {
  user?: AuthUser | null;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
  onOpenAsk?: () => void;
  onOpenSaved?: () => void;
};

const quickActions = [
  { key: 'search', label: 'Search', icon: 'search-outline' },
  { key: 'ask', label: 'Ask', icon: 'chatbubble-ellipses-outline' },
  { key: 'saved', label: 'Saved', icon: 'bookmark-outline' },
  { key: 'topics', label: 'Topics', icon: 'grid-outline' },
  { key: 'books', label: 'Books', icon: 'library-outline' },
] as const;

export default function HomeScreen({
  user,
  onOpenProfile,
  onOpenSearch,
  onOpenAsk,
  onOpenSaved,
}: HomeScreenProps) {
  const [hideSetup, setHideSetup] = useState(false);
  const firstName = user?.name?.split(' ')[0] ?? 'friend';
  const initial = firstName.charAt(0).toUpperCase();
  const showSetup = Boolean(user) && !user?.imageUrl && !hideSetup;
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const onQuickAction = (key: (typeof quickActions)[number]['key']) => {
    if (key === 'search') onOpenSearch?.();
    if (key === 'ask') onOpenAsk?.();
    if (key === 'saved') onOpenSaved?.();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onOpenProfile}
          disabled={!onOpenProfile}
          style={styles.profileRow}
        >
          {user?.imageUrl ? (
            <View style={styles.avatar}>
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <View style={styles.headerCopy}>
            <Text style={styles.greeting}>Salaam, {firstName}</Text>
            <Text style={styles.subtitle}>Seek knowledge · {today}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenSearch} style={styles.headerIcon}>
          <Ionicons name="search-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onOpenAsk}
        activeOpacity={0.9}
        style={styles.hero}
      >
        <View style={styles.heroDecorOne} />
        <View style={styles.heroDecorTwo} />
        <View style={styles.heroCopy}>
          <View style={styles.heroIcon}>
            <Ionicons name="book" size={22} color={colors.onPrimary} />
          </View>
          <Text style={styles.heroLabel}>Ask Hadith</Text>
          <Text style={styles.heroTitle}>What does{'\n'}Islam say?</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="library-outline" size={14} color={colors.primary} />
            <Text style={styles.heroMetaText}>Authentic sources</Text>
          </View>
        </View>
        <Image
          source={require('../../assets/sunnah.png')}
          style={styles.heroArt}
        />
      </TouchableOpacity>

      <View style={styles.actions}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.key}
            onPress={() => onQuickAction(action.key)}
            style={styles.actionItem}
          >
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showSetup ? (
        <TouchableOpacity
          onPress={onOpenProfile}
          activeOpacity={0.9}
          style={styles.setupBanner}
        >
          <Text style={styles.setupText}>Finish setting up your account</Text>
          <TouchableOpacity
            onPress={() => setHideSetup(true)}
            hitSlop={12}
            style={styles.setupClose}
          >
            <Ionicons name="close" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
      </View>

      <TouchableOpacity
        onPress={onOpenAsk}
        activeOpacity={0.9}
        style={styles.newsCard}
      >
        <View style={styles.newsRail}>
          <View style={styles.newsDot} />
          <View style={styles.newsLine} />
        </View>
        <View style={styles.newsCopy}>
          <Text style={styles.newsTitle}>Have you asked a Hadith today?</Text>
          <View style={styles.newsMeta}>
            <Ionicons name="time-outline" size={14} color={colors.accent} />
            <Text style={styles.newsMetaText}>Retrieve authentic narrations</Text>
          </View>
        </View>
        <View style={styles.newsCheck}>
          <Ionicons name="checkmark" size={18} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 10,
    height: 40,
    overflow: 'hidden',
    width: 40,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarInitial: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerCopy: {
    flex: 1,
  },
  greeting: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerIcon: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  hero: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    flexDirection: 'row',
    minHeight: 168,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  heroDecorOne: {
    backgroundColor: colors.secondary,
    borderRadius: 80,
    height: 160,
    opacity: 0.22,
    position: 'absolute',
    right: -20,
    top: -40,
    width: 160,
  },
  heroDecorTwo: {
    backgroundColor: colors.secondary,
    borderRadius: 50,
    height: 100,
    opacity: 0.18,
    position: 'absolute',
    right: 40,
    top: 50,
    width: 100,
  },
  heroCopy: {
    flex: 1,
    zIndex: 1,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40,
  },
  heroLabel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: 4,
  },
  heroMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  heroMetaText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  heroArt: {
    borderRadius: 20,
    height: 108,
    marginLeft: 8,
    marginTop: 12,
    width: 108,
    zIndex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
    width: 58,
  },
  actionIcon: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1.5,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  actionLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  setupBanner: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  setupText: {
    color: colors.onPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  setupClose: {
    marginLeft: 8,
  },
  sectionHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  newsCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 22,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  newsRail: {
    alignItems: 'center',
    height: 56,
    width: 14,
  },
  newsDot: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  newsLine: {
    backgroundColor: colors.accent,
    flex: 1,
    marginTop: 4,
    opacity: 0.45,
    width: 2,
  },
  newsCopy: {
    flex: 1,
  },
  newsTitle: {
    color: colors.onPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  newsMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  newsMetaText: {
    color: colors.accent,
    fontSize: 13,
  },
  newsCheck: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
