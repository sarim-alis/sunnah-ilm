import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '@/styles/components/CategoryCard';
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
