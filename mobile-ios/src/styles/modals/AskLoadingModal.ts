import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      alignItems: 'center',
      backgroundColor: 'rgba(21, 21, 21, 0.5)',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    sheet: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 24,
      paddingVertical: 28,
      width: '100%',
    },
    iconWrap: {
      alignItems: 'center',
      backgroundColor: colors.accent,
      borderColor: colors.primary,
      borderRadius: 36,
      borderWidth: 1.5,
      height: 72,
      justifyContent: 'center',
      marginBottom: 20,
      width: 72,
    },
    icon: {
      height: 40,
      width: 40,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 6,
      textAlign: 'center',
    },
    status: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 20,
      minHeight: 20,
      textAlign: 'center',
    },
    progressTrack: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 999,
      borderWidth: 1,
      height: 10,
      overflow: 'hidden',
      width: '100%',
    },
    progressFill: {
      backgroundColor: colors.primary,
      borderRadius: 999,
      height: '100%',
    },
    percentRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
      width: '100%',
    },
    percent: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
}
