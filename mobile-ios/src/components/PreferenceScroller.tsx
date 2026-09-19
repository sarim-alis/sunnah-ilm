import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ARROW, createStyles } from '@/styles/components/PreferenceScroller';
import { useTheme } from '@/theme/ThemeProvider';
import { preferenceImage } from '@/users/preferenceImages';
import type { UserPreference } from '@/users/preferences';
const VISIBLE = 2;

type PreferenceScrollerProps = {
  preferences: UserPreference[];
};

export function PreferenceScroller({ preferences }: PreferenceScrollerProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const prefKey = preferences.map((item) => item.id).join('|');

  const viewport = Math.max(0, rowWidth - ARROW * 2);
  const itemWidth = viewport > 0 ? viewport / VISIBLE : 0;
  const maxIndex = Math.max(0, preferences.length - VISIBLE);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  useEffect(() => {
    setIndex(0);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [prefKey]);

  const goTo = (next: number) => {
    if (!itemWidth) return;
    const clamped = Math.max(0, Math.min(maxIndex, next));
    setIndex(clamped);
    scrollRef.current?.scrollTo({ x: clamped * itemWidth, animated: true });
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!itemWidth) return;
    const next = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    setIndex(Math.max(0, Math.min(maxIndex, next)));
  };

  if (!preferences.length) {
    return <Text style={styles.empty}>No topics selected yet</Text>;
  }

  return (
    <View
      style={styles.row}
      onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}
    >
      <TouchableOpacity
        onPress={() => goTo(index - 1)}
        disabled={!canPrev}
        style={styles.arrow}
        accessibilityLabel="Previous topics"
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={canPrev ? colors.text : colors.border}
        />
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        style={styles.scroller}
        horizontal
        nestedScrollEnabled
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={itemWidth || undefined}
        snapToAlignment="start"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        scrollEnabled={preferences.length > VISIBLE}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        contentContainerStyle={styles.track}
      >
        {preferences.map((pref) => {
          const source = preferenceImage(pref.name);
          return (
            <View key={pref.id} style={[styles.item, { width: itemWidth || undefined }]}>
              <View style={styles.ring}>
                {source ? (
                  <Image source={source} style={styles.image} resizeMode="contain" />
                ) : (
                  <View style={styles.fallback}>
                    <Text style={styles.fallbackText}>
                      {pref.name.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {pref.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => goTo(index + 1)}
        disabled={!canNext}
        style={styles.arrow}
        accessibilityLabel="Next topics"
      >
        <Ionicons
          name="chevron-forward"
          size={22}
          color={canNext ? colors.text : colors.border}
        />
      </TouchableOpacity>
    </View>
  );
}
