import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ITenant {
  name: string;
  address: string;
  id: number;
}
export interface User {
  id: number;
  firsatName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?: ITenant;
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
