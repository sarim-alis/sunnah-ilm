import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '@/styles/screens/HadithDetailScreen';
import { useTheme } from '@/theme/ThemeProvider';

export default function HadithDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hadith</Text>
    </View>
  );
}
