import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: 'rgba(21, 21, 21, 0.45)',
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    sheet: {
      backgroundColor: colors.card,
      borderRadius: 16,
      maxHeight: '84%',
      paddingBottom: 16,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 8,
    },
    headerSide: {
      alignItems: 'flex-end',
      width: 32,
    },
    title: {
      color: colors.text,
      flex: 1,
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
    },
    hint: {
      color: colors.textMuted,
      fontSize: 13,
      marginBottom: 4,
      textAlign: 'center',
    },
    count: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 12,
      textAlign: 'center',
    },
    body: {
      maxHeight: 420,
    },
    bodyContent: {
      paddingBottom: 8,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 8,
    },
    chip: {
      alignItems: 'center',
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: '48.5%',
    },
    chipOn: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipOff: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    chipMaxed: {
      opacity: 0.45,
    },
    chipText: {
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextOn: {
      color: colors.onPrimary,
    },
    chipTextOff: {
      color: colors.text,
    },
    chipTextMaxed: {
      color: colors.textMuted,
    },
    chipRemove: {
      marginLeft: 6,
    },
    error: {
      color: colors.error,
      fontSize: 13,
      marginTop: 10,
      textAlign: 'center',
    },
    saveButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      marginTop: 16,
      minHeight: 48,
    },
    saveText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
  });
