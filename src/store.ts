import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  id: number;
  firsatName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
