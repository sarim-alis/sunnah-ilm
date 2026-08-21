import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
    },
    input: {
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
  });
}
