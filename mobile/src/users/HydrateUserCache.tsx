import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';
import { hydrateCurrentUser } from './hooks';

export function HydrateUserCache({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateCurrentUser().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return children;
}
