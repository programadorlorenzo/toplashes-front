import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUserResponseDto } from "@/generated-client";
import { authApi } from "@/lib/api";

export type { AuthUserResponseDto as AuthUser };

interface AuthState {
  token: string | null;
  user: AuthUserResponseDto | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUserResponseDto) => void;
  logout: () => void;
  updateUser: (user: AuthUserResponseDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => {
        const { token } = get();
        if (token) {
          authApi.authControllerLogout().catch(() => {});
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
    }),
    { name: "auth-storage" },
  ),
);
