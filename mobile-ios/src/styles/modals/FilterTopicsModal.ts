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
      marginBottom: 16,
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
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: '48.5%',
    },
    chipOn: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextOn: {
      color: colors.onPrimary,
    },
  });
