import { StyleSheet, Text, View } from 'react-native';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchBar } from '@/components/SearchBar';
import { appConfig } from '@/configs/app';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{appConfig.name}</Text>
      <SearchBar value="" onChangeText={() => {}} />
      <CategoryCard title="Sahih Bukhari" />
      <CategoryCard title="Sahih Muslim" />
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
});
