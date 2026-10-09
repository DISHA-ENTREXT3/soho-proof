import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { Challenge } from "@/types/challenge";

export interface FounderSubscriptionInfo {
  tier: "free" | "pro";
  status: "active" | "canceled" | "expired";
  subscriptionEndDate?: string | null;
}

/**
 * Retrieves the founder's subscription tier & status from Firestore `users` collection.
 */
export async function getFounderSubscription(founderId: string): Promise<FounderSubscriptionInfo> {
  try {
    const userDoc = await getDoc(doc(db, "users", founderId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const plan = (data.plan || data.tier || "free").toLowerCase();
      const status = (data.subscriptionStatus || "active").toLowerCase();
      const endDate = data.subscriptionEndDate || null;

      // Check if subscription has expired
      if (endDate && new Date(endDate).getTime() < Date.now()) {
        return {
          tier: "free",
          status: "expired",
          subscriptionEndDate: endDate,
        };
      }

      if (plan === "pro" && status === "active") {
        return {
          tier: "pro",
          status: "active",
          subscriptionEndDate: endDate,
        };
      }
    }
  } catch (err) {
    console.error("Error fetching founder subscription:", err);
  }

  return { tier: "free", status: "active" };
}

/**
 * Checks if a founder is allowed to create a new active challenge.
 * Free tier: Max 1 active challenge per month.
 * Pro tier: Unlimited.
 */
export async function checkFounderChallengeLimit(founderId: string): Promise<{
  allowed: boolean;
  tier: "free" | "pro";
  activeCount: number;
  reason?: string;
}> {
  const sub = await getFounderSubscription(founderId);

  // Pro tier has unlimited active challenges
  if (sub.tier === "pro") {
    return { allowed: true, tier: "pro", activeCount: 0 };
  }

  // Free tier: Count active challenges created in current month or currently open
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const q = query(
    collection(db, "challenges"),
    where("founderId", "==", founderId)
  );

  const snap = await getDocs(q);
  const activeChallenges = snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Challenge))
    .filter((c) => ["Open", "In Progress", "Judging"].includes(c.status));

  if (activeChallenges.length >= 1) {
    return {
      allowed: false,
      tier: "free",
      activeCount: activeChallenges.length,
      reason:
        "Free tier founders are limited to 1 active challenge at a time. Upgrade to Pro for unlimited active challenges!",
    };
  }

  return { allowed: true, tier: "free", activeCount: activeChallenges.length };
}

/**
 * Audits founder challenges on subscription expiration or month-end rollover.
 * - Keeps the latest created active challenge active during a 7-day grace period.
 * - Freezes all older active challenges immediately.
 * - If 7 days have passed after expiration, freezes the latest challenge as well.
 */
export async function auditFounderSubscriptionStatus(founderId: string): Promise<{
  frozenCount: number;
  graceChallengeId?: string;
  isGraceActive?: boolean;
}> {
  const sub = await getFounderSubscription(founderId);
  const q = query(
    collection(db, "challenges"),
    where("founderId", "==", founderId)
  );
  const snap = await getDocs(q);

  const allChallenges = snap.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Challenge)
  );

  // If Pro, unfreeze any previously frozen challenges if desired
  if (sub.tier === "pro") {
    const frozen = allChallenges.filter((c) => (c.status as string) === "Frozen");
    if (frozen.length > 0) {
      const batch = writeBatch(db);
      frozen.forEach((c) => {
        batch.update(doc(db, "challenges", c.id), { status: "Open" });
      });
      await batch.commit();
    }
    return { frozenCount: 0 };
  }

  // Free Tier enforcement
  const active = allChallenges
    .filter((c) => ["Open", "In Progress", "Judging"].includes(c.status))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (active.length <= 1) {
    return { frozenCount: 0 };
  }

  // Keep latest active challenge (index 0) during 7-day grace period
  const latest = active[0];
  const older = active.slice(1);

  // Calculate grace period (7 days from subscription expiration date or now)
  const expirationTime = sub.subscriptionEndDate
    ? new Date(sub.subscriptionEndDate).getTime()
    : Date.now();
  const gracePeriodEnd = expirationTime + 7 * 24 * 60 * 60 * 1000;
  const isGraceActive = Date.now() < gracePeriodEnd;

  const batch = writeBatch(db);
  let frozenCount = 0;

  // Freeze all older active challenges
  older.forEach((c) => {
    batch.update(doc(db, "challenges", c.id), {
      status: "Frozen",
      frozenReason: "Subscription tier downgraded to Free. Upgrade to Pro to unfreeze.",
      frozenAt: new Date().toISOString(),
    });
    frozenCount++;
  });

  // If grace period for latest challenge has also passed, freeze latest challenge as well
  if (!isGraceActive) {
    batch.update(doc(db, "challenges", latest.id), {
      status: "Frozen",
      frozenReason: "7-day grace period expired. Upgrade to Pro to reactivate challenges.",
      frozenAt: new Date().toISOString(),
    });
    frozenCount++;
  } else {
    // Attach warning metadata to latest challenge
    batch.update(doc(db, "challenges", latest.id), {
      inGracePeriod: true,
      graceExpiresAt: new Date(gracePeriodEnd).toISOString(),
    });
  }

  await batch.commit();

  return {
    frozenCount,
    graceChallengeId: latest.id,
    isGraceActive,
  };
}

/**
 * Stops / Cancels a challenge.
 */
export async function cancelChallenge(challengeId: string): Promise<void> {
  await updateDoc(doc(db, "challenges", challengeId), {
    status: "Cancelled",
    cancelledAt: new Date().toISOString(),
  });
}

/**
 * Permanently deletes a challenge and decrements user challenge count.
 */
export async function deleteChallenge(
  challengeId: string,
  founderId?: string
): Promise<void> {
  await deleteDoc(doc(db, "challenges", challengeId));
  if (founderId) {
    try {
      const userRef = doc(db, "users", founderId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const count = Math.max(0, (userSnap.data().challengesPosted || 1) - 1);
        await updateDoc(userRef, { challengesPosted: count });
      }
    } catch (e) {
      console.error("Failed to decrement challenge count:", e);
    }
  }
}
