import { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants/colors';
import { errorMessage, updateProfile, type AuthUser } from '@/services/auth';

type ProfileScreenProps = {
  user: AuthUser;
  onBack: () => void;
  onUpdated: (user: AuthUser) => void;
  onLogout?: () => void;
};

export default function ProfileScreen({ user, onBack, onUpdated, onLogout }: ProfileScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(user.imageUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const localTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const saveImage = async (uri: string) => {
    setImageUri(uri);
    setLoading(true);
    try {
      const updated = await updateProfile(user.name, user.email, uri);
      onUpdated(updated);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Photo updated' });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage(err, 'Could not update profile'),
      });
    } finally {
      setLoading(false);
    }
  };

  const fromGallery = async () => {
    setSheetOpen(false);
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
  };

  const takePhoto = async () => {
    setSheetOpen(false);
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;
    await saveImage(result.assets[0].uri);
  };

  const viewCurrent = () => {
    setSheetOpen(false);
    if (!imageUri) {
      Toast.show({ type: 'error', text1: 'No photo yet', text2: 'Upload a profile photo first' });
      return;
    }
    setViewOpen(true);
  };

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
          <TouchableOpacity onPress={() => setSheetOpen(true)} activeOpacity={0.85} style={styles.avatarInner}>
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
          <TouchableOpacity onPress={() => setSheetOpen(true)} style={styles.avatarBadge} activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="pencil" size={12} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.statusDot} />
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.timeText}>{localTime} local time</Text>
          </View>
        </View>
        <View style={styles.divider} />

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

      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <TouchableOpacity onPress={fromGallery} style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>Upload from gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={viewCurrent} style={styles.sheetItem}>
              <Text style={styles.sheetItemText}>View current</Text>
            </TouchableOpacity>
            <View style={styles.sheetDivider} />
            <TouchableOpacity onPress={() => setSheetOpen(false)} style={styles.sheetItem}>
              <Text style={styles.sheetCancel}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={viewOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setViewOpen(false)}
      >
        <Pressable style={styles.viewBackdrop} onPress={() => setViewOpen(false)}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.viewImage} resizeMode="contain" />
          ) : null}
        </Pressable>
      </Modal>
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
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  statusDot: {
    backgroundColor: colors.secondary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginHorizontal: 20,
    marginVertical: 18,
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
  logout: {
    alignSelf: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  sheetBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 21, 0.45)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  sheetItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetItemText: {
    color: colors.text,
    fontSize: 16,
  },
  sheetDivider: {
    backgroundColor: colors.border,
    height: 1,
  },
  sheetCancel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  viewBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(21, 21, 21, 0.88)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  viewImage: {
    borderRadius: 16,
    height: '70%',
    width: '100%',
  },
});
