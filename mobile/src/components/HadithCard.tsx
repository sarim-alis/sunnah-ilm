import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';
import type { Hadith } from '@/services/hadith';

type HadithCardProps = {
  hadith: Hadith;
};

export function HadithCard({ hadith }: HadithCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.meta}>
        {hadith.collection} {hadith.number}
      </Text>
      <Text style={styles.arabic}>{hadith.arabic}</Text>
      <Text style={styles.english}>{hadith.english}</Text>
      <Text style={styles.narrator}>{hadith.narrator}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      gap: 8,
      padding: 16,
    },
    meta: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    arabic: {
      color: colors.text,
      fontSize: 20,
      textAlign: 'right',
    },
    english: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },
    narrator: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });
}
