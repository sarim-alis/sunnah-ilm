import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    alignSelf: 'center',
    borderRadius: 24,
    height: 120,
    marginBottom: 20,
    width: 120,
  },
  avatarButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatar: {
    borderColor: colors.border,
    borderRadius: 48,
    borderWidth: 2,
    height: 96,
    width: 96,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 48,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  avatarHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitleText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    overflow: 'visible',
    paddingLeft: 12,
    paddingRight: 4,
  },
  leadingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
  },
  inputField: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    margin: 0,
    paddingBottom: 12,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 12,
    textAlignVertical: 'center',
    width: '100%',
  },
  eyeIcon: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
