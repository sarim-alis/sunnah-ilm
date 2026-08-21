import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const ARROW = 36;

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
      paddingHorizontal: 8,
    },
    ring: {
      backgroundColor: colors.card,
      borderColor: colors.primary,
      borderRadius: 48,
      borderWidth: 2,
      height: 88,
      overflow: 'hidden',
      width: 88,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    fallback: {
      alignItems: 'center',
      backgroundColor: colors.accent,
      flex: 1,
      justifyContent: 'center',
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
