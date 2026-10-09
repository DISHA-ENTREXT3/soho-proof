import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection, getDocs, query, where, orderBy
} from "firebase/firestore";

interface BuilderPublicStats {
  globalRank: number;
  totalBuilders: number;
  submissionCount: number;
  completedChallenges: number;
  winsCount: number;
  xp: number;
  topPercentile: number; // e.g. 5 means top 5%
}

interface FounderPublicStats {
  totalChallengesPosted: number;
  openChallenges: number;
  completedChallenges: number;
  totalParticipants: number;
  totalSubmissionsReceived: number;
}

/**
 * Fetches live public stats for a builder:
 * - Global XP rank by querying all talent users sorted by XP
 * - Submission count for this user
 */
export function useBuilderPublicStats(userId: string, userXP: number) {
  const [stats, setStats] = useState<BuilderPublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        // All talent users sorted by XP descending
        const usersSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "talent"))
        );
        const allBuilders = usersSnap.docs
          .map(d => ({ id: d.id, xp: Number(d.data().xp ?? 0), wins: Number(d.data().wins ?? 0) }))
          .sort((a, b) => b.xp - a.xp);

        const rank = allBuilders.findIndex(b => b.id === userId) + 1;
        const total = allBuilders.length;
        const percentile = total > 0 ? Math.round(((total - rank) / total) * 100) : 0;

        // Submissions by this user
        const subsSnap = await getDocs(
          query(collection(db, "submissions"), where("talentId", "==", userId))
        );
        const subs = subsSnap.docs.map(d => d.data());

        setStats({
          globalRank: rank || 1,
          totalBuilders: total,
          submissionCount: subs.length,
          completedChallenges: subs.filter(s => s.status === "approved" || s.status === "winner").length,
          winsCount: subs.filter(s => s.status === "winner").length,
          xp: userXP,
          topPercentile: percentile,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId, userXP]);

  return { stats, loading };
}

/**
 * Fetches live public stats for a founder:
 * - Total challenges posted, open, completed, total participants, total submissions received
 */
export function useFounderPublicStats(founderId: string) {
  const [stats, setStats] = useState<FounderPublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!founderId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const challengesSnap = await getDocs(
          query(collection(db, "challenges"), where("founderId", "==", founderId))
        );
        const challenges = challengesSnap.docs.map(d => d.data());
        const challengeIds = challengesSnap.docs.map(d => d.id);

        // Total participants across all challenges
        const totalParticipants = challenges.reduce(
          (sum, c) => sum + Number(c.currentParticipants ?? 0), 0
        );

        // Count submissions across all founder's challenges
        let totalSubmissions = 0;
        if (challengeIds.length > 0) {
          // Firestore "in" query supports max 30 items at a time
          const chunks = [];
          for (let i = 0; i < challengeIds.length; i += 30) {
            chunks.push(challengeIds.slice(i, i + 30));
          }
          for (const chunk of chunks) {
            const subsSnap = await getDocs(
              query(collection(db, "submissions"), where("challengeId", "in", chunk))
            );
            totalSubmissions += subsSnap.size;
          }
        }

        setStats({
          totalChallengesPosted: challenges.length,
          openChallenges: challenges.filter(c => c.status === "Open").length,
          completedChallenges: challenges.filter(c => c.status === "Completed").length,
          totalParticipants,
          totalSubmissionsReceived: totalSubmissions,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [founderId]);

  return { stats, loading };
}
