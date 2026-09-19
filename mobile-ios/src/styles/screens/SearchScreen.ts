import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      gap: 12,
      padding: 20,
      paddingBottom: 32,
    },
    title: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: '700',
    },
  });
}
