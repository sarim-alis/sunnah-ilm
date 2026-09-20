# Future — iOS push notifications (development build)

Do this later. In-app Notifications (API list / screen) already works in Expo Go. **Remote push does not.**

This app skips push when running inside Expo Go:

- `mobile-ios/src/services/notifications.ts` — `isExpoGo()` returns early; no token, no handler
- `registerDailyHadithPush()` also bails on simulators (`!Device.isDevice`)
- Token is only saved after login (`PUT /users/push-token`)

Windows cannot compile iOS locally. Use **EAS** to install a development client on a physical iPhone, then load JS with the Expo / Metro link **into that app**, not Expo Go.

---

## Already in the project

| Item | Value |
| --- | --- |
| App folder | `mobile-ios` |
| EAS owner | `sarim-sam` |
| EAS project id | `d3e1b64d-19c8-47dc-ba31-a3585ffb9c9e` (`app.json` → `extra.eas.projectId`) |
| Bundle id | `com.sunnahilm.app` |
| Plugin | `expo-notifications` with `mode: "development"` |
| Server | daily hadith scheduler sends Expo push to stored `expoPushToken` |

Missing for a real iOS dev client: `expo-dev-client`, `eas.json`, EAS iOS credentials / APNs.

---

## What works where

| Thing | Expo Go | Development build on iPhone |
| --- | --- | --- |
| Notifications screen (API list) | Yes | Yes |
| Daily hadith **push** + tap-to-open | No | Yes |

---

## One-time: native development client

Need a **paid Apple Developer account**. First iOS EAS build will prompt for signing + APNs.

```powershell
cd "d:\Projects\(xxxi) sunnah ilm\sunnah\mobile-ios"
npx expo install expo-dev-client
npm install -g eas-cli
eas login
eas build:configure
```

`eas.json` development profile should include:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

Register the iPhone (UDID) for ad hoc install:

```powershell
eas device:create
```

On the phone: **Settings → Privacy & Security → Developer Mode** → on.

Build and install:

```powershell
eas build --platform ios --profile development
```

When it finishes, open the EAS QR / install URL on the iPhone and install **Sunnah Ilm**. Rebuild this native app only after native deps or `app.json` change.

---

## Daily: Expo link (JS into the installed client)

```powershell
npx expo start --dev-client --tunnel
```

`--tunnel` is required from Windows so the phone can reach Metro.

Then:

1. Scan the QR, or open the `exp+sunnah-ilm-ios://...` link on the phone.
2. It must open **Sunnah Ilm** (dev client), not Expo Go.
3. If it opens Expo Go instead: open the installed app → sign in with the same Expo account → **Fetch development servers**.
4. Sign in to the app so `PUT /users/push-token` can run.

---

## After the client is installed

1. Confirm `getExpoPushTokenAsync` returns a token (not Expo Go).
2. Confirm the token is stored on the user (`expoPushToken`).
3. Trigger / wait for the daily hadith scheduler and tap the notification.
4. Tap should open the hadith via `useDailyHadithNotifications` (`type: 'daily-hadith'` + `hadithId`).
