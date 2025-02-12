import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ITenant {
  name: string;
  address: string;
  id: number;
}
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?: ITenant;
}

export interface CreateUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenantId?: ITenant;
  password?: string;
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
