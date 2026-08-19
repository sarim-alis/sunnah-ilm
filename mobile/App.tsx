import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { TabBar, type AppTab } from '@/components/TabBar';
import AskScreen from '@/screens/AskScreen';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SavedScreen from '@/screens/SavedScreen';
import SearchScreen from '@/screens/SearchScreen';
import SignupScreen from '@/screens/SignupScreen';
import { getUser, logout, type AuthUser } from '@/services/auth';

function AppContent() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [tab, setTab] = useState<AppTab>('home');

  useEffect(() => {
    getUser()
      .then(setUser)
      .finally(() => setBooting(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
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
      {booting ? (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : user ? (
        <>
          <View style={{ flex: 1 }}>
            {tab === 'home' ? (
              <HomeScreen
                user={user}
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
                user={user}
                onBack={() => setTab('home')}
                onUpdated={setUser}
                onLogout={handleLogout}
              />
            ) : null}
          </View>
          <View style={{ paddingBottom: insets.bottom }}>
            <TabBar tab={tab} onChange={setTab} />
          </View>
        </>
      ) : authScreen === 'login' ? (
        <LoginScreen
          onSuccess={setUser}
          onGoSignup={() => setAuthScreen('signup')}
        />
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
    <SafeAreaProvider>
      <AppContent />
      <StatusBar style="dark" />
      <Toast />
    </SafeAreaProvider>
  );
}
