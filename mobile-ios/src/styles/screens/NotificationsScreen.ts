import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 8,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    headerCopy: {
      flex: 1,
    },
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 2,
    },
    searchBox: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 14,
      borderWidth: 1,
      color: colors.text,
      fontSize: 15,
      marginBottom: 8,
      marginHorizontal: 20,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    filterRow: {
      flexGrow: 0,
    },
    filters: {
      gap: 8,
      paddingBottom: 8,
      paddingHorizontal: 20,
    },
    chip: {
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    chipOn: {
      backgroundColor: colors.primary,
    },
    chipText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextOn: {
      color: colors.onPrimary,
    },
    markRow: {
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 4,
    },
    markText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    scroll: {
      flex: 1,
    },
    content: {
      gap: 18,
      paddingBottom: 32,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    cardShadow: {
      borderRadius: 20,
      elevation: 3,
      shadowColor: '#151515',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    rail: {
      width: 4,
    },
    cardBody: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    itemIcon: {
      alignItems: 'center',
      borderRadius: 14,
      height: 42,
      justifyContent: 'center',
      width: 42,
    },
    itemCopy: {
      flex: 1,
    },
    itemTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    itemDescription: {
      color: colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 3,
    },
    itemMeta: {
      alignItems: 'flex-end',
      gap: 8,
    },
    itemTime: {
      color: colors.textMuted,
      fontSize: 12,
    },
    unreadDot: {
      backgroundColor: colors.primary,
      borderRadius: 4,
      height: 8,
      width: 8,
    },
    empty: {
      color: colors.textMuted,
      fontSize: 14,
      paddingTop: 24,
      textAlign: 'center',
    },
  });
