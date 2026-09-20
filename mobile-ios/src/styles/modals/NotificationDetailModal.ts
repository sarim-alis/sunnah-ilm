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
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
    },
    iconWrap: {
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 16,
      height: 52,
      justifyContent: 'center',
      marginBottom: 14,
      width: 52,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 14,
    },
    status: {
      fontSize: 13,
      fontWeight: '700',
    },
    statusRead: {
      color: colors.textMuted,
    },
    statusUnread: {
      color: colors.error,
    },
    time: {
      color: colors.textMuted,
      fontSize: 13,
    },
    body: {
      maxHeight: 280,
    },
    description: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    markButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      marginTop: 16,
      minHeight: 48,
    },
    markButtonUnread: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },
    markText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    markTextUnread: {
      color: colors.text,
    },
  });
