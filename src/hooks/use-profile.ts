import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "./use-auth";

export interface TalentProfile {
  uid: string;
  name: string;
  email: string;
  role: "talent";
  bio: string;
  skills: string[];
  location: string;
  github: string;
  twitter: string;
  portfolio: string;
  avatarInitials: string;
  xp: number;
  wins: number;
  streak: number;
  level: string;
  onboardingComplete: boolean;
  createdAt: any;
}

export interface FounderProfile {
  uid: string;
  name: string;
  email: string;
  role: "founder";
  bio: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  location: string;
  twitter: string;
  linkedin: string;
  avatarInitials: string;
  onboardingComplete: boolean;
  createdAt: any;
}

export type UserProfile = TalentProfile | FounderProfile;

export function useProfile() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile({ uid: user.uid, ...snap.data() } as UserProfile);
        }
      } catch (err) {
        console.error("useProfile: error fetching profile", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, role]);

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return { profile, profileLoading, initials };
}
