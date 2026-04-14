import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { AuthContext, UserProfile } from "./AuthContextType";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"talent" | "founder" | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role as "talent" | "founder");
            setProfileData(data as UserProfile);
            setOnboardingComplete(!!data.onboardingComplete);
          } else {
            setRole("talent");
            setOnboardingComplete(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole("talent");
          setOnboardingComplete(false);
        }
      } else {
        setRole(null);
        setProfileData(null);
        setOnboardingComplete(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, profileData, onboardingComplete, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
