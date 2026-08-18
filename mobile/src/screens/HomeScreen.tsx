import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { appConfig } from '@/configs/app';
import { colors } from '@/constants/colors';
import type { AuthUser } from '@/services/auth';

type HomeScreenProps = {
  user?: AuthUser | null;
  onLogout?: () => void;
};

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{appConfig.name}</Text>
      {user ? <Text style={styles.welcome}>Assalamu alaikum, {user.name}</Text> : null}
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
