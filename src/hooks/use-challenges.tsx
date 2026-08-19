import { useQuery } from "@tanstack/react-query";
import { Challenge, Submission } from "@/types/challenge";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, limit, Timestamp } from "firebase/firestore";
import { UserProfile, TalentProfile, FounderProfile } from "./use-profile";

const toIsoString = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const normalizeChallenge = (id: string, data: Record<string, unknown>): Challenge => {
  const scoringCriteria =
    (Array.isArray(data.scoringCriteria) ? data.scoringCriteria : undefined) ??
    (Array.isArray(data.criteria) ? data.criteria : []) ??
    [];
  const requirements = Array.isArray(data.requirements) ? data.requirements : [];

  const rewardLabel = String(data.rewardLabel ?? data.prize ?? "");
  const rewardType = (data.rewardType as Challenge["rewardType"]) ?? (rewardLabel ? "Money" : "Recognition");
  const rawHireReward = data.hireRewardDetails as Record<string, unknown> | undefined;
  const hireRewardDetails =
    rawHireReward && typeof rawHireReward === "object"
      ? {
          position: String(rawHireReward.position ?? ""),
          compensation: String(rawHireReward.compensation ?? ""),
          responsibilities: String(rawHireReward.responsibilities ?? ""),
          skillsRequired: String(rawHireReward.skillsRequired ?? ""),
        }
      : undefined;

  return {
    id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    category: data.category as Challenge["category"],
    status: (data.status as Challenge["status"]) ?? "Open",
    difficulty: data.difficulty as Challenge["difficulty"],
    xpReward: Number(data.xpReward ?? 0),
    rewardType,
    rewardLabel,
    hireRewardDetails,
    prize: String(data.prize ?? ""),
    deadline: toIsoString(data.deadline),
    maxParticipants: Number(data.maxParticipants ?? 0),
    currentParticipants: Number(data.currentParticipants ?? 0),
    founderId: String(data.founderId ?? ""),
    founderName: String(data.founderName ?? "Founder"),
    founderAvatar: String(data.founderAvatar ?? "F"),
    companyName: String(data.companyName ?? "Personal"),
    scoringCriteria: scoringCriteria as Challenge["scoringCriteria"],
    criteria: scoringCriteria as Challenge["criteria"],
    submissions: Array.isArray(data.submissions) ? (data.submissions as Challenge["submissions"]) : undefined,
    requirements: requirements as string[],
    createdAt: toIsoString(data.createdAt),
  };
};

const normalizeSubmission = (id: string, data: Record<string, unknown>): Submission => ({
  id,
  challengeId: String(data.challengeId ?? ""),
  talentId: String(data.talentId ?? ""),
  talentName: String(data.talentName ?? "Builder"),
  talentAvatar: String(data.talentAvatar ?? "B"),
  submittedAt: toIsoString(data.submittedAt),
  status: (data.status as Submission["status"]) ?? "Pending",
  score: typeof data.score === "number" ? data.score : undefined,
  feedback: typeof data.feedback === "string" ? data.feedback : undefined,
  summary: String(data.summary ?? ""),
  link: String(data.link ?? ""),
});

export const useChallenges = () => {
  return useQuery<Challenge[]>({
    queryKey: ["challenges"],
    queryFn: async () => {
      const challengesCol = collection(db, "challenges");
      const q = query(challengesCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((challengeDoc) => normalizeChallenge(challengeDoc.id, challengeDoc.data()));
    },
  });
};

export const useChallenge = (id: string | undefined) => {
  return useQuery<Challenge | null>({
    queryKey: ["challenge", id],
    queryFn: async () => {
      if (!id) throw new Error("Challenge ID is required");
      const docRef = doc(db, "challenges", id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return normalizeChallenge(docSnap.id, docSnap.data());
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
      return snapshot.docs.map((submissionDoc) => normalizeSubmission(submissionDoc.id, submissionDoc.data()));
    },
    enabled: !!challengeId,
  });
};

export const useFounders = () => {
  return useQuery<FounderProfile[]>({
    queryKey: ["founders"],
    queryFn: async () => {
      const usersCol = collection(db, "users");
      const q = query(usersCol, where("role", "==", "founder"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as FounderProfile[];
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
      const totalRewardValue = challenges.reduce((sum, c) => {
        if (c.rewardType !== "Money") return sum;
        const value = parseInt((c.rewardLabel || "").replace(/[^0-9]/g, "")) || 0;
        return sum + value;
      }, 0);

      return {
        activeChallenges,
        totalRewardValue: `$${totalRewardValue.toLocaleString()}`,
        // Backward compatibility for existing UI fields.
        totalPrize: `$${totalRewardValue.toLocaleString()}`,
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

export const useFounderChallenges = (founderId: string | undefined) => {
  return useQuery<Challenge[]>({
    queryKey: ["founder-challenges", founderId],
    queryFn: async () => {
      if (!founderId) return [];
      const challengesCol = collection(db, "challenges");
      const q = query(challengesCol, where("founderId", "==", founderId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((challengeDoc) => normalizeChallenge(challengeDoc.id, challengeDoc.data()));
    },
    enabled: !!founderId,
  });
};

export const useTalentSubmissions = (talentId: string | undefined) => {
  return useQuery<Submission[]>({
    queryKey: ["submissions", "talent", talentId],
    queryFn: async () => {
      if (!talentId) return [];
      const submissionsCol = collection(db, "submissions");
      const q = query(submissionsCol, where("talentId", "==", talentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((submissionDoc) => normalizeSubmission(submissionDoc.id, submissionDoc.data()));
    },
    enabled: !!talentId,
  });
};

