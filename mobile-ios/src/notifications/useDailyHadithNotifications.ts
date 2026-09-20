import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { getHadithById } from '@/services/hadith';
import {
  dailyHadithIdFromNotification,
  registerDailyHadithPush,
} from '@/services/notifications';
import type { HadithRecord } from '@/types';

type UseDailyHadithNotificationsArgs = {
  enabled: boolean;
  onOpenHadith: (hadith: HadithRecord) => void;
};

export function useDailyHadithNotifications({
  enabled,
  onOpenHadith,
}: UseDailyHadithNotificationsArgs) {
  useEffect(() => {
    if (!enabled) return;
    void registerDailyHadithPush();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const openFrom = async (notification?: Notifications.Notification | null) => {
      const id = dailyHadithIdFromNotification(notification);
      if (!id) return;
      const hadith = await getHadithById(id);
      if (hadith) onOpenHadith(hadith);
    };

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      void openFrom(response?.notification);
    });

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      void openFrom(response.notification);
    });

    return () => {
      sub.remove();
    };
  }, [enabled, onOpenHadith]);
}
