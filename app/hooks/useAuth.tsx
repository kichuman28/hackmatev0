'use client';

import { useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setNeedsOnboarding(true);
          await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            createdAt: new Date(),
            onboardingCompleted: false,
          });
        } else {
          setNeedsOnboarding(!userDoc.data()?.onboardingCompleted);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { user, loading, needsOnboarding, signInWithGoogle, logout };
};
