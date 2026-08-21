import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AuthUser } from '@/services/auth';
import { createStyles } from '@/styles/modals/EditProfileModal';
import { useTheme } from '@/theme/ThemeProvider';

type EditProfileModalProps = {
  visible: boolean;
  user: AuthUser;
  saving: boolean;
  onClose: () => void;
  onSave: (data: { name: string; email: string; password?: string }) => void;
};

export function EditProfileModal({
  visible,
  user,
  saving,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setShowPassword(false);
    setError('');
  }, [visible, user.email, user.name]);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    onSave({
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoid}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerSide} />
              <Text style={styles.title}>Edit profile</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.headerSide}
                hitSlop={8}
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={28} color={colors.error} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Name</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leadingIcon}>
                <Ionicons name="person-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leadingIcon}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leadingIcon}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              </View>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  underlineColorAndroid="transparent"
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowPassword((value) => !value)}
                style={styles.eyeButton}
                hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
            >
              {saving ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
