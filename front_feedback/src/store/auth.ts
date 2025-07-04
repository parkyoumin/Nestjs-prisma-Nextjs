// store/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logout, withdraw as withdrawService } from "@/services/authService";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        try {
          await logout();
          set({ user: null });
        } catch (error) {
          console.error("Logout failed", error);
          set({ user: null });
        }
      },
      withdraw: async () => {
        try {
          await withdrawService();
          set({ user: null });
        } catch (error) {
          console.error("Withdraw failed", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
