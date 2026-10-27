/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Alert, Text } from 'react-native';
import AppNavigator from '../src/navigation/AppNavigator';
import LoginScreen from '../src/screens/LoginScreen';
import RegistrationScreen from '../src/screens/RegistrationScreen';

jest.mock('@react-native-firebase/auth', () => {
  const methods = {
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    updateProfile: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
  };
  return {
    __esModule: true,
    ...methods,
    mockMethods: methods,
  };
});

const mockAuthMethods = jest.requireMock('@react-native-firebase/auth')
  .mockMethods;
let mockAuthStateCallback: ((user: unknown) => void) | undefined;

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthStateCallback = undefined;
  mockAuthMethods.getAuth.mockReturnValue('mock-auth');
  mockAuthMethods.onAuthStateChanged.mockImplementation(
    (_auth: unknown, callback: (user: unknown) => void) => {
      mockAuthStateCallback = callback;
      callback(null);
      return jest.fn();
    },
  );
  mockAuthMethods.signInWithEmailAndPassword.mockResolvedValue(undefined);
  mockAuthMethods.createUserWithEmailAndPassword.mockResolvedValue({
    user: { uid: 'new-user' },
  });
  mockAuthMethods.updateProfile.mockResolvedValue(undefined);
  mockAuthMethods.sendPasswordResetEmail.mockResolvedValue(undefined);
  mockAuthMethods.signOut.mockResolvedValue(undefined);
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });

  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome back'),
  ).toBe(true);
});

test('navigates between login and registration', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });

  await ReactTestRenderer.act(() => {
    const pressables = renderer!.root.findAll(
      node => typeof node.props.onPress === 'function',
    );
    pressables[pressables.length - 1].props.onPress();
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Create your account'),
  ).toBe(true);

  await ReactTestRenderer.act(() => {
    const pressables = renderer!.root.findAll(
      node => typeof node.props.onPress === 'function',
    );
    pressables[pressables.length - 1].props.onPress();
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome back'),
  ).toBe(true);
});

test('signs in using Firebase with the entered credentials', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onCreateAccount={() => {}} />);
  });

  const emailInput = renderer!.root.findByProps({
    accessibilityLabel: 'Email address',
  });
  const passwordInput = renderer!.root.findByProps({
    accessibilityLabel: 'Password',
  });
  await ReactTestRenderer.act(() => {
    emailInput.props.onChangeText('taylor@example.com');
    passwordInput.props.onChangeText('TestPassword123!');
  });

  await ReactTestRenderer.act(async () => {
    await renderer!.root.findByProps({ accessibilityLabel: 'Sign in' }).props.onPress();
  });

  expect(mockAuthMethods.signInWithEmailAndPassword).toHaveBeenCalledWith(
    'mock-auth',
    'taylor@example.com',
    'TestPassword123!',
  );
});

test('opens an activity placeholder and returns to the home screen', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });

  await ReactTestRenderer.act(() => {
    mockAuthStateCallback?.({ uid: 'user-id' });
  });

  const activityCard = renderer!.root.find(
    node =>
      node.props.accessibilityLabel ===
      'Memory Match. Find matching pictures and exercise your memory.',
  );
  await ReactTestRenderer.act(() => {
    activityCard.props.onPress();
  });

  const memoryTitle = renderer!.root
    .findAllByType(Text)
    .some(text => text.props.children === 'Memory Match');
  expect(memoryTitle).toBe(true);

  const backButton = renderer!.root.find(
    node => node.props.accessibilityLabel === 'Back to activities',
  );
  await ReactTestRenderer.act(() => {
    backButton.props.onPress();
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome! 💚'),
  ).toBe(true);

  const currentSignOutButton = renderer!.root.find(
    node => node.props.accessibilityLabel === 'Sign out',
  );
  await ReactTestRenderer.act(async () => {
    await currentSignOutButton.props.onPress();
  });
  expect(mockAuthMethods.signOut).toHaveBeenCalledWith('mock-auth');
});

test('prevents home access until authentication state is confirmed', async () => {
  mockAuthMethods.onAuthStateChanged.mockImplementation(
    (_auth: unknown, callback: (user: unknown) => void) => {
      mockAuthStateCallback = callback;
      return jest.fn();
    },
  );
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome! 💚'),
  ).toBe(false);

  await ReactTestRenderer.act(() => {
    mockAuthStateCallback?.(null);
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome back'),
  ).toBe(true);
});

test('signs out an authenticated user and returns to login after auth update', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<AppNavigator />);
  });
  await ReactTestRenderer.act(() => {
    mockAuthStateCallback?.({ uid: 'user-id' });
  });

  mockAuthMethods.signOut.mockImplementation(async () => {
    mockAuthStateCallback?.(null);
  });
  const signOutButton = renderer!.root.find(
    node => node.props.accessibilityLabel === 'Sign out',
  );
  await ReactTestRenderer.act(async () => {
    await signOutButton.props.onPress();
  });
  expect(
    renderer!.root
      .findAllByType(Text)
      .some(text => text.props.children === 'Welcome back'),
  ).toBe(true);
});

test('forgot password sends reset email for a valid email address', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<LoginScreen onCreateAccount={() => {}} />);
  });
  const emailInput = renderer!.root.findByProps({
    accessibilityLabel: 'Email address',
  });
  await ReactTestRenderer.act(() => {
    emailInput.props.onChangeText('person@example.com');
  });
  const resetButton = renderer!.root.find(
    node => node.props.accessibilityRole === 'button' &&
      node.findAllByType(Text).some(text => text.props.children === 'Forgot password?'),
  );
  await ReactTestRenderer.act(() => resetButton.props.onPress());
  expect(mockAuthMethods.sendPasswordResetEmail).toHaveBeenCalledWith(
    'mock-auth',
    'person@example.com',
  );
});

test('creates an account and saves the display name to the Firebase profile', async () => {
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  mockAuthMethods.createUserWithEmailAndPassword.mockResolvedValue({
    user: { uid: 'new-user' },
  });
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <RegistrationScreen onSignIn={() => {}} />,
    );
  });

  const nameInput = renderer!.root.findByProps({
    accessibilityLabel: 'Full name',
  });
  const emailInput = renderer!.root.findByProps({
    accessibilityLabel: 'Email address',
  });
  const passwordInput = renderer!.root.findByProps({
    accessibilityLabel: 'Password',
  });
  const confirmationInput = renderer!.root.findByProps({
    accessibilityLabel: 'Confirm password',
  });
  await ReactTestRenderer.act(() => {
    nameInput.props.onChangeText('Taylor Example');
    emailInput.props.onChangeText('taylor@example.com');
    passwordInput.props.onChangeText('SecureExample123!');
    confirmationInput.props.onChangeText('SecureExample123!');
  });

  const checkbox = renderer!.root.find(
    node => node.props.accessibilityRole === 'checkbox',
  );
  await ReactTestRenderer.act(() => checkbox.props.onPress());
  const createButton = renderer!.root.find(
    node =>
      node.props.accessibilityRole === 'button' &&
      node.findAllByType(Text).some(text => text.props.children === 'Create account'),
  );
  await ReactTestRenderer.act(async () => {
    await createButton.props.onPress();
  });

  expect(mockAuthMethods.createUserWithEmailAndPassword).toHaveBeenCalledWith(
    'mock-auth',
    'taylor@example.com',
    'SecureExample123!',
  );
  expect(mockAuthMethods.updateProfile).toHaveBeenCalledWith(
    { uid: 'new-user' },
    {
    displayName: 'Taylor Example',
    },
  );
  expect(alert).toHaveBeenCalledWith('Account created', 'Welcome to MindBloom!');
  alert.mockRestore();
});
