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
      paddingHorizontal: 20,
      paddingVertical: 24,
      width: '100%',
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    message: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 10,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    button: {
      alignItems: 'center',
      borderRadius: 12,
      flex: 1,
      justifyContent: 'center',
      minHeight: 48,
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    cancelText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
