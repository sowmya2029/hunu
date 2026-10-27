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
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from '@react-native-firebase/auth';
import { getAuthErrorMessage } from '../auth/authErrorMessage';
import FormInput from '../components/FormInput';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../assets/theme';

type RegistrationValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

type RegistrationScreenProps = {
  onSignIn: () => void;
};

const initialValues: RegistrationValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function RegistrationScreen({ onSignIn }: RegistrationScreenProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateValue = (field: keyof RegistrationValues, value: string) => {
    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const submit = async () => {
    const nextErrors: RegistrationErrors = {};
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Enter your full name.';
    }
    if (!emailIsValid) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (values.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters.';
    }
    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    setTermsError(!acceptedTerms);

    if (Object.keys(nextErrors).length > 0 || !acceptedTerms) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        getAuth(),
        values.email.trim(),
        values.password,
      );
      await updateProfile(credential.user, {
        displayName: values.fullName.trim(),
      });
      Alert.alert('Account created', 'Welcome to MindBloom!');
    } catch (error: unknown) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started on your journey.
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              autoCapitalize="words"
              autoComplete="name"
              error={errors.fullName}
              label="Full name"
              onChangeText={value => updateValue('fullName', value)}
              placeholder="e.g. Alex Morgan"
              returnKeyType="next"
              value={values.fullName}
            />
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
              autoComplete="new-password"
              error={errors.password}
              label="Password"
              onChangeText={value => updateValue('password', value)}
              placeholder="At least 8 characters"
              secureTextEntry
              value={values.password}
            />
            <FormInput
              autoCapitalize="none"
              error={errors.confirmPassword}
              label="Confirm password"
              onChangeText={value => updateValue('confirmPassword', value)}
              placeholder="Re-enter your password"
              secureTextEntry
              value={values.confirmPassword}
            />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptedTerms }}
              onPress={() => {
                setAcceptedTerms(current => !current);
                setTermsError(false);
              }}
              style={styles.termsRow}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text>{' '}
                and <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </Pressable>
            {termsError ? (
              <Text accessibilityRole="alert" style={styles.termsError}>
                Please accept the terms to continue.
              </Text>
            ) : null}
            {submitError ? (
              <Text accessibilityRole="alert" style={styles.termsError}>
                {submitError}
              </Text>
            ) : null}

            <PrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? 'Creating account…' : 'Create account'}
              onPress={submit}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable accessibilityRole="button" onPress={onSignIn}>
                <Text style={styles.link}>Sign in</Text>
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
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 2,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 5,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    marginRight: 10,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
  },
  termsText: {
    color: colors.secondaryText,
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  termsError: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 5,
    marginTop: 4,
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
});

export default RegistrationScreen;
