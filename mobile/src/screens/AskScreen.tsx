import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';

export default function AskScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Ask</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
      padding: 20,
    },
    title: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: '700',
    },
  });
}
