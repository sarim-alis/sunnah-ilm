import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(21, 21, 21, 0.45)',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 36,
    },
    sheet: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      width: '100%',
    },
    item: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    itemText: {
      color: colors.text,
      fontSize: 16,
    },
    divider: {
      backgroundColor: colors.border,
      height: 1,
    },
    cancel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
