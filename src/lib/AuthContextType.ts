import { createContext } from "react";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  name: string;
  email: string;
  role: "talent" | "founder";
  createdAt: Timestamp;
}

export interface AuthContextType {
  user: User | null;
  role: "talent" | "founder" | null;
  profileData: UserProfile | null;
  onboardingComplete: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
