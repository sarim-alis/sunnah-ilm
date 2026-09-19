import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/constants/colors';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
    },
    header: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      justifyContent: 'center',
      minHeight: 56,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerBack: {
      left: 12,
      padding: 8,
      position: 'absolute',
      zIndex: 1,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
    },
    stepIndicator: {
      backgroundColor: colors.card,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    stepItem: {
      alignItems: 'center',
      flex: 1,
    },
    stepCircle: {
      alignItems: 'center',
      backgroundColor: colors.border,
      borderRadius: 16,
      height: 32,
      justifyContent: 'center',
      marginBottom: 8,
      width: 32,
    },
    stepCircleActive: {
      backgroundColor: colors.primary,
    },
    stepNumber: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    stepNumberActive: {
      color: colors.onPrimary,
    },
    stepLabel: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: 'center',
    },
    stepLabelActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    stepContent: {
      paddingBottom: 20,
    },
    stepTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    inputRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    chipScroll: {
      flexDirection: 'row',
    },
    chip: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      color: colors.textMuted,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextActive: {
      color: colors.onPrimary,
    },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    wrapChip: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    actions: {
      backgroundColor: colors.card,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    actionButton: {
      alignItems: 'center',
      borderRadius: 12,
      flex: 1,
      flexDirection: 'row',
      gap: 8,
      justifyContent: 'center',
      minHeight: 48,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    backButton: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },
    nextButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    actionButtonTextDisabled: {
      color: colors.textMuted,
    },
    nextButtonText: {
      color: colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
