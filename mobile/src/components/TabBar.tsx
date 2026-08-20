import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/theme/ThemeProvider';

export type AppTab = 'home' | 'search' | 'ask' | 'saved' | 'profile';

type TabBarProps = {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
};

const tabs: {
  key: AppTab;
  idle: keyof typeof Ionicons.glyphMap;
  active: keyof typeof Ionicons.glyphMap;
  center?: boolean;
}[] = [
  { key: 'home', idle: 'home-outline', active: 'home' },
  { key: 'search', idle: 'book-outline', active: 'book' },
  { key: 'ask', idle: 'sparkles', active: 'sparkles', center: true },
  { key: 'saved', idle: 'bookmark-outline', active: 'bookmark' },
  { key: 'profile', idle: 'person-outline', active: 'person' },
];

export function TabBar({ tab, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      {tabs.map((item) => {
        const active = tab === item.key;
        if (item.center) {
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => onChange(item.key)}
              style={styles.centerWrap}
            >
              <View style={styles.centerButton}>
                <Ionicons name={item.active} size={22} color={colors.onPrimary} />
              </View>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => onChange(item.key)}
            style={styles.item}
          >
            <Ionicons
              name={active ? item.active : item.idle}
              size={24}
              color={active ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    bar: {
      alignItems: 'center',
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 8,
      paddingTop: 10,
    },
    item: {
      alignItems: 'center',
      flex: 1,
      height: 44,
      justifyContent: 'center',
    },
    centerWrap: {
      alignItems: 'center',
      flex: 1,
      marginTop: -18,
    },
    centerButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 28,
      height: 56,
      justifyContent: 'center',
      width: 56,
    },
  });
}
