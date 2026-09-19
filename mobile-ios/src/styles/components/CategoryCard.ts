import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      gap: 4,
      padding: 16,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    count: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });
}
