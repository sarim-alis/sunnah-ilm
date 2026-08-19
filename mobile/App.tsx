import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { TabBar, type AppTab } from '@/components/TabBar';
import { queryClient } from '@/query/client';
import AskScreen from '@/screens/AskScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SavedScreen from '@/screens/SavedScreen';
import SearchScreen from '@/screens/SearchScreen';
import SignupScreen from '@/screens/SignupScreen';
import { HydrateUserCache } from '@/users/HydrateUserCache';
import { useCurrentUser, useLogout } from '@/users/hooks';

function AppContent() {
  const insets = useSafeAreaInsets();
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [tab, setTab] = useState<AppTab>('home');
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setAuthScreen('login');
    setTab('home');
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingBottom: user ? 0 : insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingTop: insets.top,
      }}
    >
      {user ? (
        <>
          <View style={{ flex: 1 }}>
            {tab === 'home' ? (
              <HomeScreen
                onOpenProfile={() => setTab('profile')}
                onOpenSearch={() => setTab('search')}
                onOpenAsk={() => setTab('ask')}
                onOpenSaved={() => setTab('saved')}
              />
            ) : null}
            {tab === 'search' ? <SearchScreen /> : null}
            {tab === 'ask' ? <AskScreen /> : null}
            {tab === 'saved' ? <SavedScreen /> : null}
            {tab === 'profile' ? (
              <ProfileScreen
                onBack={() => setTab('home')}
                onLogout={handleLogout}
              />
            ) : null}
          </View>
          <View style={{ paddingBottom: insets.bottom }}>
            <TabBar tab={tab} onChange={setTab} />
          </View>
        </>
      ) : authScreen === 'login' ? (
        <LoginScreen onGoSignup={() => setAuthScreen('signup')} />
      ) : (
        <SignupScreen
          onSuccess={() => setAuthScreen('login')}
          onGoLogin={() => setAuthScreen('login')}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <HydrateUserCache>
          <AppContent />
        </HydrateUserCache>
        <StatusBar style="dark" />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
