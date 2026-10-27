const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use':
    'An account already exists for this email. Try signing in instead.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/invalid-credential':
    'Email or password is incorrect. Check your details and try again.',
  'auth/user-disabled':
    'This account has been disabled. Please contact support.',
  'auth/user-not-found':
    'No account was found for this email. Check it or create an account.',
  'auth/wrong-password':
    'Email or password is incorrect. Check your details and try again.',
  'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
  'auth/too-many-requests':
    'There have been too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed':
    'Could not connect. Check your internet connection and try again.',
  'auth/operation-not-allowed':
    'Email and password sign-in is not enabled for this Firebase project.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return (
      authErrorMessages[error.code] ??
      'We could not complete that request. Please try again.'
    );
  }

  return 'We could not complete that request. Please try again.';
}
