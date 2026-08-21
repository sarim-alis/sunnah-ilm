import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { LogoutIcon } from '@/components/LogoutIcon';
import { PencilIcon } from '@/components/PencilIcon';
import { PreferenceScroller } from '@/components/PreferenceScroller';
import { EditPreferencesModal } from '@/modals/EditPreferencesModal';
import { EditProfileModal } from '@/modals/EditProfileModal';
import { LogoutModal } from '@/modals/LogoutModal';
import { PhotoSheetModal } from '@/modals/PhotoSheetModal';
import { ViewPhotoModal } from '@/modals/ViewPhotoModal';
import { errorMessage } from '@/services/auth';
import { createStyles } from '@/styles/screens/ProfileScreen';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrentUser, useUpdateProfile } from '@/users/hooks';
import { normalizePreferences } from '@/users/preferences';
import type { HadithTopic } from '@/users/preferences';

type ProfileScreenProps = {
  onBack: () => void;
  onLogout?: () => void | Promise<void>;
};

export default function ProfileScreen({ onBack, onLogout }: ProfileScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: user } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const imageUri = previewUri ?? user?.imageUrl ?? null;
  const preferences = normalizePreferences(user?.preferences);

  const saveImage = async (uri: string) => {
    if (!user) return;
    setPreviewUri(uri);
    setLoading(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: user.name,
        email: user.email,
        imageUri: uri,
      });
      setPreviewUri(null);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Photo updated' });
    } catch (err) {
      setPreviewUri(null);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage(err, 'Could not update profile'),
      });
    } finally {
      setLoading(false);
    }
  };

  const afterSheetClose = (action: () => Promise<void>) => {
    setSheetOpen(false);
    setTimeout(() => {
      void action();
    }, 400);
  };

  const fromGallery = () => {
    afterSheetClose(async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Toast.show({
          type: 'error',
          text1: 'Permission needed',
          text2: 'Allow photo access to upload a profile image',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets[0]) return;
      await saveImage(result.assets[0].uri);
    });
  };

  const takePhoto = () => {
    afterSheetClose(async () => {
      try {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Toast.show({
            type: 'error',
            text1: 'Permission needed',
            text2: 'Allow camera access to take a profile photo',
          });
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: Platform.OS === 'ios',
          aspect: [1, 1],
          quality: 0.7,
          cameraType: ImagePicker.CameraType.back,
        });

        if (result.canceled || !result.assets[0]) return;
        await saveImage(result.assets[0].uri);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Camera failed',
          text2: errorMessage(err, 'Could not open the camera'),
        });
      }
    });
  };

  const viewCurrent = () => {
    setSheetOpen(false);
    if (!imageUri) {
      Toast.show({ type: 'error', text1: 'No photo yet', text2: 'Upload a profile photo first' });
      return;
    }
    setViewOpen(true);
  };

  const saveDetails = async (data: { name: string; email: string; password?: string }) => {
    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync(data);
      setEditOpen(false);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage(err, 'Could not update profile'),
      });
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async (next: HadithTopic[]) => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: user.name,
        email: user.email,
        preferences: { topics: next },
      });
      setPrefsOpen(false);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Preferences saved' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: errorMessage(err, 'Could not save preferences'),
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmLogout = async () => {
    if (!onLogout) return;
    setLoggingOut(true);
    try {
      await onLogout();
    } catch (err) {
      setLoggingOut(false);
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: errorMessage(err, 'Cannot log out'),
      });
    }
  };

  if (!user) return null;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        {onLogout ? (
          <TouchableOpacity
            onPress={() => setLogoutOpen(true)}
            style={styles.logoutButton}
            activeOpacity={0.8}
            accessibilityLabel="Logout"
          >
            <LogoutIcon size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.topBarSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrap}>
          <TouchableOpacity
            onPress={() => setSheetOpen(true)}
            activeOpacity={0.85}
            style={styles.avatarInner}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSheetOpen(true)}
            style={styles.avatarBadge}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <PencilIcon size={14} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.identity}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            onPress={() => setEditOpen(true)}
            style={styles.editIcon}
            hitSlop={8}
            accessibilityLabel="Edit profile"
          >
            <PencilIcon size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowLabel}>Name</Text>
            <Text style={styles.rowValue}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: colors.border }]}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
          </View>
          <View style={styles.rowCopy}>
            <Text style={styles.rowLabel}>Email Address</Text>
            <Text style={styles.rowValue}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity
            onPress={() => setPrefsOpen(true)}
            style={styles.editIcon}
            hitSlop={8}
            accessibilityLabel="Edit preferences"
          >
            <PencilIcon size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.prefBlock}>
          <PreferenceScroller preferences={preferences} />
        </View>
      </ScrollView>

      <PhotoSheetModal
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onGallery={fromGallery}
        onCamera={takePhoto}
        onView={viewCurrent}
      />
      <ViewPhotoModal
        visible={viewOpen}
        uri={imageUri}
        onClose={() => setViewOpen(false)}
      />
      <EditProfileModal
        visible={editOpen}
        user={user}
        saving={saving}
        onClose={() => setEditOpen(false)}
        onSave={saveDetails}
      />
      <EditPreferencesModal
        visible={prefsOpen}
        preferences={preferences}
        saving={saving}
        onClose={() => setPrefsOpen(false)}
        onSave={savePreferences}
      />
      <LogoutModal
        visible={logoutOpen}
        confirming={loggingOut}
        onClose={() => {
          if (!loggingOut) setLogoutOpen(false);
        }}
        onConfirm={() => {
          void confirmLogout();
        }}
      />
    </View>
  );
}
