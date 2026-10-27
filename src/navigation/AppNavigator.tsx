import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import ActivityPlaceholderScreen from '../screens/ActivityPlaceholderScreen';
import HomeScreen, { type ActivityId } from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import { getAuthErrorMessage } from '../auth/authErrorMessage';

function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityId>('memory');

  useEffect(
    () =>
      onAuthStateChanged(getAuth(), user => {
        setIsAuthenticated(Boolean(user));
      }),
    [],
  );

  const logout = async () => {
    try {
      await signOut(getAuth());
      setShowActivity(false);
    } catch (error: unknown) {
      Alert.alert('Unable to sign out', getAuthErrorMessage(error));
    }
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          accessibilityLabel="Checking sign-in status"
          color="#315C49"
          size="large"
        />
      </View>
    );
  }

  if (!isAuthenticated) {
    if (showRegistration) {
      return <RegistrationScreen onSignIn={() => setShowRegistration(false)} />;
    }

    return (
      <LoginScreen onCreateAccount={() => setShowRegistration(true)} />
    );
  }

  if (showActivity) {
    return (
      <ActivityPlaceholderScreen
        activity={selectedActivity}
        onBack={() => setShowActivity(false)}
      />
    );
  }

  return (
    <HomeScreen
      onLogout={logout}
      onSelectActivity={activity => {
        setSelectedActivity(activity);
        setShowActivity(true);
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppNavigator;
