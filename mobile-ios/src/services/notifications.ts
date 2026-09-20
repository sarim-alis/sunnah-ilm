import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiConfig } from '@/configs/api';

function isExpoGo() {
  return Constants.appOwnership === 'expo';
}

if (!isExpoGo()) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function projectId() {
  return (
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId
  );
}

export function dailyHadithIdFromNotification(
  notification?: Notifications.Notification | null,
) {
  const data = notification?.request.content.data;
  if (!data || data.type !== 'daily-hadith') return null;
  return typeof data.hadithId === 'string' ? data.hadithId : null;
}

export async function registerDailyHadithPush() {
  try {
    if (isExpoGo() || !Device.isDevice) return null;

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const next = await Notifications.requestPermissionsAsync();
      status = next.status;
    }
    if (status !== 'granted') return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-hadith', {
        name: 'Hadith of the Day',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const id = projectId();
    if (!id) return null;

    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId: id })
    ).data;

    const auth = await AsyncStorage.getItem('token');
    if (!auth) return token;

    await fetch(`${apiConfig.baseUrl}/users/push-token`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return token;
  } catch {
    return null;
  }
}

export async function clearDailyHadithPush() {
  try {
    if (isExpoGo()) return;
    const auth = await AsyncStorage.getItem('token');
    if (!auth) return;
    await fetch(`${apiConfig.baseUrl}/users/push-token`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth}` },
    });
  } catch {
    return;
  }
}
