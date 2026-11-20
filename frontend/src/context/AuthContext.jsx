import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        if (firebaseUser) {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          setProfile(snap.exists() ? snap.data() : null);
        } else {
          setProfile(null);
        }
      } catch (err) {
        // Don't leave the app stuck on a blank screen if Firestore is unreachable.
        console.error('Could not load user profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  async function register(name, email, password) {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName: name });

    const newProfile = {
      name,
      email,
      photoURL: '',
      role: 'traveler',
      travelPreferences: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', newUser.uid), newProfile);
    setProfile(newProfile);
    return newUser;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const { user: googleUser } = await signInWithPopup(auth, new GoogleAuthProvider());

    const ref = doc(db, 'users', googleUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const newProfile = {
        name: googleUser.displayName || 'Traveler',
        email: googleUser.email,
        photoURL: googleUser.photoURL || '',
        role: 'traveler',
        travelPreferences: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, newProfile);
      setProfile(newProfile);
    } else {
      setProfile(snap.data());
    }
    return googleUser;
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
