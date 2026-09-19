import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '@/styles/components/HadithCard';
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
