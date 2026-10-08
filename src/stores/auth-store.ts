import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, API_BASE_URL } from '@/lib/api';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  roleId: number;
  roleName: string;
  permissions: string[];
  branchIds: number[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      logout: () => {
        const { token } = get();
        if (token) {
          api
            .post(
              '/auth/logout',
              {},
              {
                baseURL: API_BASE_URL,
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            .catch(() => {});
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' },
  ),
);
