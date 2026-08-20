import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';
import { preferenceImage } from '@/users/preferenceImages';
import type { UserPreference } from '@/users/preferences';

const ARROW = 36;
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
                  <Image source={source} style={styles.image} resizeMode="cover" />
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

const createStyles = (colors: ThemeColors) =>
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
