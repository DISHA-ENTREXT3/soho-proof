import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { AuthContext, UserProfile } from "./AuthContextType";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"talent" | "founder" | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role as "talent" | "founder");
            setProfileData(data as UserProfile);
          } else {
            // Default to talent if no doc exists (fallback)
            setRole("talent");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole("talent");
        }
      } else {
        setRole(null);
        setProfileData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, profileData, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
