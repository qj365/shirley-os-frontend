import { auth } from '@/lib/firebase';
import { api, Omit_User_createdAt_or_updatedAt_ } from '@/src/lib/api/customer';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  appUser: Omit_User_createdAt_or_updatedAt_ | null;
  user: User | null; //firebase user
  token: string | null; //firebase auth token
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAppUser: (appUser: Omit_User_createdAt_or_updatedAt_ | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      appUser: null,
      user: null,
      token: null,
      loading: true,
      signup: async (email, password) => {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        set({
          user: credential.user,
          token: await credential.user.getIdToken(),
        });
      },
      login: async (email, password) => {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        set({
          user: credential.user,
          token: await credential.user.getIdToken(),
        });
      },
      logout: async () => {
        await signOut(auth);
        set({ user: null, token: null, appUser: null });
      },
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      setLoading: loading => set({ loading }),
      setAppUser: appUser => set({ appUser }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
      partialize: state => ({
        user: state.user ? JSON.parse(JSON.stringify(state.user)) : null,
        token: state.token,
      }), // Serialize user object
    }
  )
);

// Hydrate state with Firebase listener (call this in a top-level component or hook)
export const initializeAuth = () => {
  const { setUser, setToken, setLoading, setAppUser } = useAuthStore.getState();

  return onAuthStateChanged(auth, async user => {
    try {
      setLoading(true);

      if (user) {
        const token = await user.getIdToken();
        setUser(user);
        setToken(token);

        // Fetch user data from API
        try {
          const appUser = await api.customer.customerGetMe();
          setAppUser(appUser);
        } catch (apiError) {
          console.error('Failed to fetch user data:', apiError);
          // Don't clear auth state if API fails, just don't set appUser
        }
      } else {
        setUser(null);
        setToken(null);
        setAppUser(null);
      }
    } catch (error) {
      console.error('Auth state change error:', error);
      setUser(null);
      setToken(null);
      setAppUser(null);
    } finally {
      setLoading(false);
    }
  });
};
