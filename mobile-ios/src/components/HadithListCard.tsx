import { useMemo, useRef, type ReactNode } from 'react';
import { Animated, Pressable, View } from 'react-native';
import type { HadithRecord } from '@/services/hadith';
import { createStyles } from '@/styles/screens/adminHadiths';
import { useTheme } from '@/theme/ThemeProvider';

type HadithListCardProps = {
  item: HadithRecord;
  onPress: () => void;
  actions: ReactNode;
};

export function HadithListCard({ item, onPress, actions }: HadithListCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const progress = useRef(new Animated.Value(0)).current;
  const snippet = item.translation?.english || item.text;

  const animateTo = (value: number, done?: () => void) => {
    Animated.timing(progress, {
      toValue: value,
      duration: 140,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) done?.();
    });
  };

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.card, colors.primary],
  });
  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });
  const metaColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary, colors.onPrimary],
  });
  const textColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text, colors.onPrimary],
  });
  const mutedColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textMuted, colors.onPrimary],
  });

  return (
    <Pressable
      onPressIn={() => animateTo(1)}
      onPressOut={() => {
        setTimeout(() => animateTo(0), 120);
      }}
      onPress={onPress}
      accessibilityLabel="View Hadith"
    >
      <Animated.View style={[styles.card, { backgroundColor, borderColor }]}>
        <View style={styles.cardCopy}>
          <Animated.Text style={[styles.cardMeta, { color: metaColor }]}>
            {item.book} {item.hadithNumber}
            {item.topic ? ` · ${item.topic}` : ''}
          </Animated.Text>
          <Animated.Text style={[styles.cardNarrator, { color: textColor }]}>
            {item.narrator}
          </Animated.Text>
          {item.chapter ? (
            <Animated.Text
              style={[styles.cardChapter, { color: textColor }]}
              numberOfLines={1}
            >
              {item.chapter}
            </Animated.Text>
          ) : null}
          <Animated.Text
            style={[styles.cardText, { color: mutedColor }]}
            numberOfLines={2}
          >
            {snippet}
          </Animated.Text>
        </View>
        <View style={styles.cardActions}>{actions}</View>
      </Animated.View>
    </Pressable>
  );
}
