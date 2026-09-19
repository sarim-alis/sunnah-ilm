import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    bar: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 8,
      paddingTop: 10,
    },
    item: {
      alignItems: 'center',
      flex: 1,
      height: 44,
      justifyContent: 'center',
    },
    centerWrap: {
      alignItems: 'center',
      flex: 1,
      marginTop: -18,
    },
    centerButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 28,
      height: 56,
      justifyContent: 'center',
      width: 56,
    },
  });
}
