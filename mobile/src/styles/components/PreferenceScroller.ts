import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const ARROW = 36;
export const PREF_ICON = 88;

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 8,
    },
    arrow: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: ARROW,
    },
    scroller: {
      flex: 1,
    },
    track: {
      alignItems: 'center',
    },
    item: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    ring: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.primary,
      borderRadius: 22,
      borderWidth: 2,
      height: PREF_ICON,
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 8,
      width: PREF_ICON,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    fallback: {
      alignItems: 'center',
      backgroundColor: colors.accent,
      borderRadius: 14,
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    fallbackText: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: '700',
    },
    name: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 8,
      textAlign: 'center',
    },
    empty: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 8,
    },
  });
