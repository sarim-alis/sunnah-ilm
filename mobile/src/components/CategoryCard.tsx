import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';

type CategoryCardProps = {
  title: string;
  count?: number;
};

export function CategoryCard({ title, count }: CategoryCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {count != null ? <Text style={styles.count}>{count}</Text> : null}
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
      gap: 4,
      padding: 16,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    count: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });
}
