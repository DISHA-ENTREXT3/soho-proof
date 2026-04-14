import { useQuery } from "@tanstack/react-query";
import { Challenge, Submission } from "@/types/challenge";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit } from "firebase/firestore";
import { UserProfile, TalentProfile } from "./use-profile";


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

export const useSubmissions = (challengeId: string | undefined) => {
  return useQuery<Submission[]>({
    queryKey: ["submissions", challengeId],
    queryFn: async () => {
      if (!challengeId) return [];
      const submissionsCol = collection(db, "submissions");
      const q = query(submissionsCol, where("challengeId", "==", challengeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
    },
    enabled: !!challengeId,
  });
};

export const useFounders = () => {
  return useQuery({
    queryKey: ["founders"],
    queryFn: async () => {
      const usersCol = collection(db, "users");
      const q = query(usersCol, where("role", "==", "founder"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as any[];
    }
  });
};

export const useFounderStats = (founderId: string | undefined) => {
  return useQuery({
    queryKey: ["founder-stats", founderId],
    queryFn: async () => {
      if (!founderId) return null;
      const challengesCol = collection(db, "challenges");
      const q = query(challengesCol, where("founderId", "==", founderId));
      const snapshot = await getDocs(q);
      const challenges = snapshot.docs.map(doc => doc.data() as Challenge);
      
      const activeChallenges = challenges.filter(c => c.status === "Open").length;
      const totalPrize = challenges.reduce((sum, c) => {
        const value = parseInt(c.prize.replace(/[^0-9]/g, "")) || 0;
        return sum + value;
      }, 0);

      return {
        activeChallenges,
        totalPrize: `$${totalPrize.toLocaleString()}`,
        totalChallenges: challenges.length
      };
    },
    enabled: !!founderId
  });
};

export const useGlobalLeaderboard = () => {
  return useQuery<TalentProfile[]>({
    queryKey: ["global-leaderboard"],
    queryFn: async () => {
      const usersCol = collection(db, "users");
      const q = query(usersCol, where("role", "==", "talent"), orderBy("xp", "desc"), limit(20));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as TalentProfile[];
    }
  });
};
