import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/challenge";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

export const useChallenges = () => {
  return useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: async () => {
      const challengesCol = collection(db, "challenges");
      const q = query(challengesCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Challenge[];
    },
  });
};

export const useChallenge = (id: string | undefined) => {
  return useQuery<Challenge>({
    queryKey: ["challenge", id],
    queryFn: async () => {
      if (!id) throw new Error("Challenge ID is required");
      const docRef = doc(db, "challenges", id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Challenge not found");
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Challenge;
    },
    enabled: !!id,
  });
};
