import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      gap: 8,
      padding: 16,
    },
    meta: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    arabic: {
      color: colors.text,
      fontSize: 20,
      textAlign: 'right',
    },
    english: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    narrator: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });
}
