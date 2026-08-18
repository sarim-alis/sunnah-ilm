import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { appConfig } from '@/configs/app';
import { colors } from '@/constants/colors';
import type { AuthUser } from '@/services/auth';

type HomeScreenProps = {
  user?: AuthUser | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
};

export default function HomeScreen({ user, onLogout, onOpenProfile }: HomeScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{appConfig.name}</Text>
      {user ? (
        <TouchableOpacity
          onPress={onOpenProfile}
          disabled={!onOpenProfile}
          style={styles.userRow}
        >
          {user.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback} />
          )}
          <Text style={styles.welcome}>Assalamu alaikum, {user.name}</Text>
        </TouchableOpacity>
      ) : null}
      <SearchBar value="" onChangeText={() => {}} />
      <CategoryCard title="Sahih Bukhari" />
      <CategoryCard title="Sahih Muslim" />
      {onLogout ? (
        <TouchableOpacity onPress={onLogout} style={styles.logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    gap: 12,
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  avatar: {
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  avatarFallback: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  welcome: {
    color: colors.textMuted,
    fontSize: 16,
  },
  logout: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
