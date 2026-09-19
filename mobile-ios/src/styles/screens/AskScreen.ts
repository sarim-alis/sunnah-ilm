import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      paddingBottom: 32,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 4,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 20,
    },
    sectionLabel: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 10,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    chip: {
      alignItems: 'center',
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    chipOn: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipIcon: {
      borderRadius: 10,
      height: 28,
      width: 28,
    },
    chipText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextOn: {
      color: colors.onPrimary,
    },
    inputWrap: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 16,
      minHeight: 120,
      padding: 14,
    },
    input: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      textAlignVertical: 'top',
    },
    questionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    hintBtn: {
      alignItems: 'center',
      backgroundColor: colors.accent,
      borderColor: colors.primary,
      borderRadius: 24,
      borderWidth: 1.5,
      height: 44,
      justifyContent: 'center',
      marginRight: 10,
      width: 44,
    },
    hintIcon: {
      height: 36,
      width: 36,
    },
    askBtn: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 14,
      justifyContent: 'center',
      minHeight: 48,
    },
    askBtnDisabled: {
      opacity: 0.5,
    },
    askBtnText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    emptyPrefs: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 8,
      textAlign: 'center',
    },
    pickBtn: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      marginTop: 16,
      minHeight: 44,
      paddingHorizontal: 18,
    },
    pickText: {
      color: colors.onPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    explanationCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      marginTop: 24,
      padding: 16,
    },
    explanationLabel: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    explanationText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    resultsHead: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 12,
      marginTop: 24,
    },
    list: {
      gap: 0,
    },
    error: {
      color: colors.error,
      fontSize: 14,
      marginTop: 12,
      textAlign: 'center',
    },
  });
}
