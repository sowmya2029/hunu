import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { getAuthErrorMessage } from '../auth/authErrorMessage';
import { colors } from '../assets/theme';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

type LoginScreenProps = {
  onCreateAccount: () => void;
};

function LoginScreen({ onCreateAccount }: LoginScreenProps) {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');

  const updateValue = (field: keyof LoginValues, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setResetError('');
  };

  const submit = async () => {
    const nextErrors: LoginErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!values.password) {
      nextErrors.password = 'Enter your password.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(
        getAuth(),
        values.email.trim(),
        values.password,
      );
    } catch (error: unknown) {
      setErrors({ password: getAuthErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async () => {
    const email = values.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResetError('Enter your email address above to reset your password.');
      return;
    }

    setResetError('');
    try {
      await sendPasswordResetEmail(getAuth(), email);
      Alert.alert(
        'Check your email',
        'We sent a password reset link to your email address.',
      );
    } catch (error: unknown) {
      setResetError(getAuthErrorMessage(error));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <Text style={styles.eyebrow}>COGNATIVE</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to your account.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              keyboardType="email-address"
              label="Email address"
              onChangeText={value => updateValue('email', value)}
              placeholder="you@example.com"
              returnKeyType="next"
              value={values.email}
            />
            <FormInput
              autoCapitalize="none"
              autoComplete="current-password"
              error={errors.password}
              label="Password"
              onChangeText={value => updateValue('password', value)}
              placeholder="Enter your password"
              returnKeyType="done"
              secureTextEntry
              value={values.password}
            />

            <Pressable
              accessibilityRole="button"
              onPress={resetPassword}
              style={styles.forgotPassword}
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
            {resetError ? (
              <Text accessibilityRole="alert" style={styles.resetError}>
                {resetError}
              </Text>
            ) : null}

            <PrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? 'Signing in…' : 'Sign in'}
              onPress={submit}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don’t have an account? </Text>
              <Pressable
                accessibilityRole="button"
                onPress={onCreateAccount}
              >
                <Text style={styles.link}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    width: 56,
  },
  logoText: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '800',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 9,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1B2B4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 4,
  },
  resetError: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
