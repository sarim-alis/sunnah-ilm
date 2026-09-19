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
    avoid: {
      width: '100%',
    },
    sheet: {
      backgroundColor: colors.card,
      borderRadius: 16,
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
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 6,
      marginTop: 12,
    },
    inputWrap: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 56,
      overflow: 'visible',
      paddingLeft: 8,
      paddingRight: 4,
    },
    leadingIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
    },
    inputField: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 8,
      paddingVertical: 4,
    },
    input: {
      color: colors.text,
      fontSize: 16,
      margin: 0,
      paddingBottom: 12,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 12,
      textAlignVertical: 'center',
      width: '100%',
    },
    eyeButton: {
      alignItems: 'center',
      height: 52,
      justifyContent: 'center',
      width: 52,
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
      marginTop: 20,
      minHeight: 48,
    },
    saveText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
  });
