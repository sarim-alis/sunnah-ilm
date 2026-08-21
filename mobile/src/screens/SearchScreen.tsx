import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SearchBar } from '@/components/SearchBar';
import { createStyles } from '@/styles/screens/SearchScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Search</Text>
      <SearchBar value="" onChangeText={() => {}} />
    </View>
  );
}
