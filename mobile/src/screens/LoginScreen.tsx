import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { colors } from '@/constants/colors';
import { errorMessage, login, type AuthUser } from '@/services/auth';
import { authStyles as styles } from './authStyles';

type LoginScreenProps = {
  onSuccess: (user: AuthUser) => void;
  onGoSignup: () => void;
};

export default function LoginScreen({ onSuccess, onGoSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Login successful!' });
      onSuccess(data.user);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage(err, 'Login failed'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.overlay}>
            <Image
              source={require('../../public/sunnah.png')}
              style={styles.logo}
              accessibilityLabel="Sunnah-Ilm"
            />
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.subtitleText}>Sign in to continue</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.leadingIcon}>
                  <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                </View>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.leadingIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                </View>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={32}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={styles.buttonContainer}
            >
              <View style={styles.primaryButton}>
                {loading ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onGoSignup}>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
