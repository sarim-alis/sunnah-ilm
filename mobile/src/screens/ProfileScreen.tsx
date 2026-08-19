import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants/colors';
import { PencilIcon } from '@/components/PencilIcon';
import { EditProfileModal } from '@/modals/EditProfileModal';
import { PhotoSheetModal } from '@/modals/PhotoSheetModal';
import { ViewPhotoModal } from '@/modals/ViewPhotoModal';
import { errorMessage } from '@/services/auth';
import { useCurrentUser, useUpdateProfile } from '@/users/hooks';

type ProfileScreenProps = {
  onBack: () => void;
  onLogout?: () => void;
};

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { data: user } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const imageUri = previewUri ?? user?.imageUrl ?? null;

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

  if (!user) return null;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.topBarSpacer} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 8,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  topBarSpacer: {
    width: 40,
  },
  content: {
    paddingBottom: 32,
    paddingTop: 16,
  },
  avatarWrap: {
    alignSelf: 'center',
    height: 112,
    width: 112,
  },
  avatarInner: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 3,
    height: 112,
    overflow: 'hidden',
    width: 112,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    flex: 1,
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  avatarBadge: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    bottom: 2,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    width: 28,
  },
  identity: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionHead: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  editIcon: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  rowIcon: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  rowCopy: {
    flex: 1,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
});
