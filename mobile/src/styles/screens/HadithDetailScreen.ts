import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: 8,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    backButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    title: {
      color: colors.text,
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      paddingHorizontal: 12,
      textAlign: 'center',
    },
    topBarSpacer: {
      width: 40,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingBottom: 40,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    field: {
      marginBottom: 20,
    },
    fieldFlex: {
      flex: 1,
      marginBottom: 20,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    valueBox: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    value: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    valueRtl: {
      textAlign: 'right',
    },
    empty: {
      color: colors.textMuted,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    chipText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    heading: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 20,
      marginTop: 8,
    },
  });
}
