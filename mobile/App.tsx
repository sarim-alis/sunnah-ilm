import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import SignupScreen from '@/screens/SignupScreen';
import { getUser, logout, type AuthUser } from '@/services/auth';

function AppContent() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    getUser()
      .then(setUser)
      .finally(() => setBooting(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAuthScreen('login');
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingBottom: insets.bottom,
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
        <HomeScreen user={user} onLogout={handleLogout} />
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
    </SafeAreaProvider>
  );
}
