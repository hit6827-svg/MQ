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
  deleteField,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase.ts';

export interface CloudProgressState {
  solvedExerciseIds: string[];
  verifiedCount: number;
  struggledCount: number;
  defaultTimerMinutes: number;
}

interface UserAccountDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  solvedExerciseIds: string[];
  verifiedCount: number;
  struggledCount: number;
  defaultTimerMinutes: number;
}

interface AuthContextValue {
  user: User | null;
  isAuthReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signOutUser: () => Promise<void>;
  cloudProgress: CloudProgressState | null;
  syncCloudProgress: (progress: CloudProgressState) => Promise<void>;
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

const LOCAL_GUEST_PROGRESS_KEY = 'mathquest_progress_v2';

function readLocalGuestProgress(): CloudProgressState {
  try {
    const raw = localStorage.getItem(LOCAL_GUEST_PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        solvedExerciseIds: Array.isArray(parsed.solvedExerciseIds)
          ? parsed.solvedExerciseIds.filter((x: unknown) => typeof x === 'string').slice(0, 50)
          : [],
        verifiedCount: typeof parsed.verifiedCount === 'number' ? Math.max(0, parsed.verifiedCount) : 0,
        struggledCount: typeof parsed.struggledCount === 'number' ? Math.max(0, parsed.struggledCount) : 0,
        defaultTimerMinutes:
          typeof parsed.defaultTimerMinutes === 'number'
            ? Math.min(180, Math.max(0, parsed.defaultTimerMinutes))
            : 15,
      };
    }
  } catch {
    // ignore storage read errors
  }
  return {
    solvedExerciseIds: [],
    verifiedCount: 0,
    struggledCount: 0,
    defaultTimerMinutes: 15,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudProgress, setCloudProgress] = useState<CloudProgressState | null>(null);

  const ensureUserProfile = useCallback(async (currentUser: User) => {
    const userPath = `users/${currentUser.uid}`;
    const userRef = doc(db, 'users', currentUser.uid);
    const guestLocal = readLocalGuestProgress();

    const safeDisplayName = (currentUser.displayName || 'Mathematician').slice(0, 128);
    const safeEmail = (currentUser.email || '').slice(0, 256);
    const safePhotoURL = (currentUser.photoURL || '').slice(0, 512);

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const initial: CloudProgressState = guestLocal;
        await setDoc(userRef, {
          uid: currentUser.uid,
          displayName: safeDisplayName,
          email: safeEmail,
          photoURL: safePhotoURL,
          solvedExerciseIds: initial.solvedExerciseIds,
          verifiedCount: initial.verifiedCount,
          struggledCount: initial.struggledCount,
          defaultTimerMinutes: initial.defaultTimerMinutes,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setCloudProgress(initial);
      } else {
        const data = snap.data() as Partial<UserAccountDoc>;
        const remoteSolved = Array.isArray(data.solvedExerciseIds)
          ? data.solvedExerciseIds.filter((x): x is string => typeof x === 'string')
          : [];
        const mergedSolved = Array.from(new Set([...remoteSolved, ...guestLocal.solvedExerciseIds])).slice(0, 50);
        const mergedVerified = Math.max(
          typeof data.verifiedCount === 'number' ? data.verifiedCount : 0,
          guestLocal.verifiedCount,
          mergedSolved.length
        );
        const mergedStruggled = Math.max(
          typeof data.struggledCount === 'number' ? data.struggledCount : 0,
          guestLocal.struggledCount
        );
        const resolvedTimer =
          typeof data.defaultTimerMinutes === 'number'
            ? Math.min(180, Math.max(0, data.defaultTimerMinutes))
            : guestLocal.defaultTimerMinutes;

        const mergedProgress: CloudProgressState = {
          solvedExerciseIds: mergedSolved,
          verifiedCount: mergedVerified,
          struggledCount: mergedStruggled,
          defaultTimerMinutes: resolvedTimer,
        };

        setCloudProgress(mergedProgress);

        await updateDoc(userRef, {
          displayName: safeDisplayName,
          email: safeEmail,
          photoURL: safePhotoURL,
          solvedExerciseIds: mergedSolved,
          verifiedCount: mergedVerified,
          struggledCount: mergedStruggled,
          defaultTimerMinutes: resolvedTimer,
          scheduleStartedAt: deleteField(),
          scheduleFastForwardHours: deleteField(),
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
        setCloudProgress(null);
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
      setCloudProgress(null);
    } catch (error) {
      setAuthError(mapAuthError(error));
    }
  }, []);

  const syncCloudProgress = useCallback(
    async (progress: CloudProgressState) => {
      if (!user) return;
      const userPath = `users/${user.uid}`;
      const userRef = doc(db, 'users', user.uid);
      const boundedSolved = progress.solvedExerciseIds.slice(0, 50);
      const safeTimer = Math.min(180, Math.max(0, Math.round(progress.defaultTimerMinutes)));
      try {
        await updateDoc(userRef, {
          solvedExerciseIds: boundedSolved,
          verifiedCount: Math.max(0, Math.round(progress.verifiedCount)),
          struggledCount: Math.max(0, Math.round(progress.struggledCount)),
          defaultTimerMinutes: safeTimer,
          scheduleStartedAt: deleteField(),
          scheduleFastForwardHours: deleteField(),
          updatedAt: serverTimestamp(),
        });
        setCloudProgress({
          solvedExerciseIds: boundedSolved,
          verifiedCount: Math.max(0, Math.round(progress.verifiedCount)),
          struggledCount: Math.max(0, Math.round(progress.struggledCount)),
          defaultTimerMinutes: safeTimer,
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
          handleFirestoreError(error, OperationType.UPDATE, userPath);
        }
        console.warn('Cloud progress update deferred:', error);
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
        cloudProgress,
        syncCloudProgress,
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
