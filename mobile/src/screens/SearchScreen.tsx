import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '@/components/SearchBar';
import { colors } from '@/constants/colors';

export default function SearchScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Search</Text>
      <SearchBar value="" onChangeText={() => {}} />
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
    fontSize: 24,
    fontWeight: '700',
  },
});
