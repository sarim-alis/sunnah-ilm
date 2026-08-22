import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '@/styles/components/TabBar';
import { useTheme } from '@/theme/ThemeProvider';

export type AppTab = 'home' | 'search' | 'ask' | 'saved' | 'profile' | 'add' | 'hadiths';

type TabBarProps = {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
  variant?: 'user' | 'admin';
};

const userTabs: {
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

const adminTabs: typeof userTabs = [
  { key: 'home', idle: 'home-outline', active: 'home' },
  { key: 'hadiths', idle: 'book-outline', active: 'book' },
  { key: 'add', idle: 'add', active: 'add', center: true },
  { key: 'profile', idle: 'person-outline', active: 'person' },
];

export function TabBar({ tab, onChange, variant = 'user' }: TabBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tabs = variant === 'admin' ? adminTabs : userTabs;

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
