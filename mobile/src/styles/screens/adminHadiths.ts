import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 16,
    },
    searchWrap: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: 12,
    },
    searchInput: {
      color: colors.text,
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    searchCross: {
      alignItems: 'center',
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    list: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    card: {
      alignItems: 'flex-start',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: 'row',
      marginBottom: 12,
      padding: 16,
    },
    cardCopy: {
      flex: 1,
      flexShrink: 1,
      marginRight: 12,
      minWidth: 0,
    },
    cardMeta: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    cardNarrator: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      marginTop: 4,
    },
    cardChapter: {
      color: colors.text,
      flexShrink: 1,
      fontSize: 13,
      marginTop: 4,
    },
    cardText: {
      color: colors.textMuted,
      flexShrink: 1,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      width: '100%',
    },
    deleteButton: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 18,
      borderWidth: 1,
      flexShrink: 0,
      height: 36,
      justifyContent: 'center',
      marginTop: 4,
      width: 36,
    },
    empty: {
      color: colors.textMuted,
      fontSize: 15,
      paddingTop: 40,
      textAlign: 'center',
    },
    loader: {
      paddingTop: 40,
    },
  });
