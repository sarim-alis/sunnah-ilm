import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    header: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      justifyContent: 'center',
      minHeight: 56,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerBack: {
      left: 12,
      padding: 8,
      position: 'absolute',
      zIndex: 1,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    meta: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    narrator: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '700',
      marginTop: 8,
    },
    chapter: {
      color: colors.text,
      fontSize: 15,
      marginTop: 6,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 16,
    },
    chip: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    chipText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    section: {
      marginTop: 24,
    },
    label: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    body: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 26,
    },
    arabic: {
      textAlign: 'right',
    },
  });
}
