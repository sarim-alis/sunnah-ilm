import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/screens/HomeScreen';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrentUser, useToggleMode } from '@/users/hooks';

type HomeScreenProps = {
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

export default function HomeScreen({onOpenProfile, onOpenSearch, onOpenAsk, onOpenSaved}: HomeScreenProps) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: user } = useCurrentUser();
  const toggleMode = useToggleMode();
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

  const isAdmin = user?.role === 'admin';

  const header = (
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
          <Text style={styles.subtitle}>
            {isAdmin ? 'Admin' : `Seek knowledge · ${today}`}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => {
            void toggleMode();
          }}
          style={styles.headerIcon}
          accessibilityLabel={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Ionicons
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        {isAdmin ? null : (
          <TouchableOpacity onPress={onOpenSearch} style={styles.headerIcon}>
            <Ionicons name="search-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const heroInner = (
    <>
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
    </>
  );

  if (isAdmin) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {header}
        <View style={styles.hero}>{heroInner}</View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {header}

      <View style={styles.hero}>{heroInner}</View>

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

      <View style={styles.newsCard}>
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
      </View>
    </ScrollView>
  );
}
