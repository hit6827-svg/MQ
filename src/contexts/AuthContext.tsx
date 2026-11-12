import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase.ts';
import { getStoredSchedule, saveSchedule } from '../lib/problemSchedule.ts';

interface UserAccountDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  scheduleStartedAt: number;
  scheduleFastForwardHours: number;
}

interface AuthContextValue {
  user: User | null;
  isAuthReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  syncCloudSchedule: (startedAt: number, fastForwardHours: number) => Promise<void>;
  cloudSchedule: { startedAt: number; fastForwardHours: number } | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in popup was closed before completing authentication.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by your browser. Please allow popups for this site and try again.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'Sign-in request was superseded. Please try again.';
  }
  if (code === 'auth/unauthorized-domain') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return `Domain "${host}" is not authorized in Firebase Auth. Add it under Firebase Console -> Authentication -> Settings -> Authorized domains.`;
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error during sign-in. Check your connection and try again.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Could not complete sign-in. Please try again.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudSchedule, setCloudSchedule] = useState<{
    startedAt: number;
    fastForwardHours: number;
  } | null>(null);

  const ensureUserProfile = useCallback(async (currentUser: User) => {
    const userPath = `users/${currentUser.uid}`;
    const userRef = doc(db, 'users', currentUser.uid);
    const localSched = getStoredSchedule();

    const safeDisplayName = (currentUser.displayName || 'Mathematician').slice(0, 128);
    const safeEmail = (currentUser.email || '').slice(0, 256);
    const safePhotoURL = (currentUser.photoURL || '').slice(0, 512);

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newProfile: Record<string, unknown> = {
          uid: currentUser.uid,
          displayName: safeDisplayName,
          email: safeEmail,
          photoURL: safePhotoURL,
          scheduleStartedAt: localSched.startedAt,
          scheduleFastForwardHours: localSched.fastForwardHours,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setCloudSchedule(localSched);
      } else {
        const data = snap.data() as Partial<UserAccountDoc>;
        const resolvedStartedAt =
          typeof data.scheduleStartedAt === 'number'
            ? Math.min(data.scheduleStartedAt, localSched.startedAt)
            : localSched.startedAt;
        const resolvedFastForward =
          typeof data.scheduleFastForwardHours === 'number'
            ? Math.max(data.scheduleFastForwardHours, localSched.fastForwardHours)
            : localSched.fastForwardHours;

        // Sync merged schedule locally and back to user doc
        saveSchedule(resolvedStartedAt, resolvedFastForward);
        setCloudSchedule({
          startedAt: resolvedStartedAt,
          fastForwardHours: resolvedFastForward,
        });

        await updateDoc(userRef, {
          displayName: safeDisplayName,
          email: safeEmail,
          photoURL: safePhotoURL,
          scheduleStartedAt: resolvedStartedAt,
          scheduleFastForwardHours: resolvedFastForward,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
        handleFirestoreError(error, OperationType.WRITE, userPath);
      }
      console.warn('User profile sync deferred (offline or local mode):', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        try {
          await ensureUserProfile(currentUser);
        } catch (e) {
          console.error(e);
        }
      } else {
        setCloudSchedule(null);
      }
    });

    return () => unsubscribe();
  }, [ensureUserProfile]);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      const message = mapAuthError(error);
      setAuthError(message);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setCloudSchedule(null);
    } catch (error) {
      setAuthError(mapAuthError(error));
    }
  }, []);

  const syncCloudSchedule = useCallback(
    async (startedAt: number, fastForwardHours: number) => {
      if (!user) return;
      const userPath = `users/${user.uid}`;
      const userRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userRef, {
          scheduleStartedAt: startedAt,
          scheduleFastForwardHours: fastForwardHours,
          updatedAt: serverTimestamp(),
        });
        setCloudSchedule({ startedAt, fastForwardHours });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
          handleFirestoreError(error, OperationType.UPDATE, userPath);
        }
        console.warn('Cloud schedule update deferred:', error);
      }
    },
    [user]
  );

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        isSigningIn,
        authError,
        clearAuthError,
        signInWithGoogle,
        signOutUser,
        syncCloudSchedule,
        cloudSchedule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
