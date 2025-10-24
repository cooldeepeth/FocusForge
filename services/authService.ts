import type { User } from '../types';

// --- MOCK FIREBASE AUTHENTICATION SERVICE ---

let currentUser: User | null = null;
let authStateListener: ((user: User | null) => void) | null = null;

const notifyListener = () => {
  if (authStateListener) {
    // Simulate async nature of auth state changes
    setTimeout(() => authStateListener && authStateListener(currentUser), 0);
  }
};

/**
 * Attaches an observer for changes to the user's sign-in state.
 * @param callback A function to be called when the auth state changes.
 * @returns An unsubscribe function.
 */
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  authStateListener = callback;
  // Simulate the initial check which might take a moment
  setTimeout(() => {
    // On page load, let's pretend the user was not logged in.
    // A real implementation would check localStorage/sessionStorage.
    if(currentUser === null) {
        callback(null);
    }
  }, 500);

  return () => {
    authStateListener = null; // Unsubscribe
  };
};

/**
 * Simulates signing up a new user with email and password.
 */
export const signUpWithEmail = async (email: string, password?: string): Promise<User> => {
  console.log("Simulating sign up for:", email);
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === 'exists@test.com') {
    throw new Error("auth/email-already-in-use");
  }
  if(!password || password.length < 6) {
    throw new Error("auth/weak-password");
  }

  currentUser = {
    uid: 'uid_' + Date.now(),
    email,
    displayName: email.split('@')[0],
  };
  notifyListener();
  return currentUser;
};

/**
 * Simulates signing in a user with email and password.
 */
export const signInWithEmail = async (email: string, password?: string): Promise<User> => {
  console.log("Simulating sign in for:", email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation for mock
  if (email !== 'user@test.com' || password !== 'password123') {
      if(email === 'exists@test.com' && password !== 'password123') {
        throw new Error("auth/wrong-password");
      }
    throw new Error("auth/user-not-found");
  }

  currentUser = {
    uid: 'uid_existing_123',
    email,
    displayName: 'Test User',
  };
  notifyListener();
  return currentUser;
};

/**
 * Simulates signing in with a Google account popup.
 */
export const signInWithGoogle = async (): Promise<User> => {
    console.log("Simulating sign in with Google...");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a successful Google Sign-In
    currentUser = {
        uid: 'uid_google_456',
        email: 'googleuser@gmail.com',
        displayName: 'Google User',
    };
    notifyListener();
    return currentUser;
};


/**
 * Simulates signing out the current user.
 */
export const signOut = async (): Promise<void> => {
  console.log("Simulating sign out...");
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = null;
  notifyListener();
};