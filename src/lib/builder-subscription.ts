import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BuilderTier = "free" | "pro";

export interface BuilderSubscriptionInfo {
  tier: BuilderTier;
  /** "active" if subscription is current, "expired" if end date has passed, "restricted" if manually restricted */
  status: "active" | "expired" | "restricted";
  subscriptionEndDate?: string | null;
  cycleStartDate?: string | null;
}

export interface BuilderLimitResult {
  allowed: boolean;
  tier: BuilderTier;
  founderSubmissionsThisMonth: number;
  monthlyLimit: number;
  reason?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Free-tier builders can participate in up to this many founder-posted challenges per month */
export const FREE_TIER_MONTHLY_FOUNDER_LIMIT = 4;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStartOfCurrentMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Retrieves the builder's subscription tier & status from Firestore `users` collection.
 */
export async function getBuilderSubscription(
  builderId: string
): Promise<BuilderSubscriptionInfo> {
  try {
    const userDoc = await getDoc(doc(db, "users", builderId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const email = (data.email || "").toLowerCase();
      const role = (data.role || "").toLowerCase();

      // Automatically grant Pro status to @entrext.com, @entrext.in, entrext accounts, and admins
      if (
        email.endsWith("@entrext.com") ||
        email.endsWith("@entrext.in") ||
        email.includes("entrext") ||
        role === "admin" ||
        data.subscriptionTier === "pro"
      ) {
        return {
          tier: "pro",
          status: "active",
        };
      }

      const plan = (data.plan || data.tier || data.subscriptionTier || "free").toLowerCase();
      const rawStatus = (data.subscriptionStatus || "active").toLowerCase();
      const endDate: string | null = data.subscriptionEndDate || null;
      const cycleStartDate: string | null = data.cycleStartDate || null;

      if (data.accountRestricted === true) {
        return { tier: "free", status: "restricted", subscriptionEndDate: endDate, cycleStartDate };
      }

      if (endDate && new Date(endDate).getTime() < Date.now()) {
        return { tier: "free", status: "expired", subscriptionEndDate: endDate, cycleStartDate };
      }

      if (plan === "pro" && rawStatus === "active") {
        return { tier: "pro", status: "active", subscriptionEndDate: endDate, cycleStartDate };
      }
    }
  } catch (err) {
    console.error("Error fetching builder subscription:", err);
  }

  return { tier: "free", status: "active", cycleStartDate: getStartOfCurrentMonth() };
}

/**
 * Checks whether a builder can submit to a challenge this month.
 *
 * Rules:
 *  - Admin challenges (postedByAdmin=true): ALWAYS allowed, unlimited, no quota impact.
 *  - Pro builders: unlimited founder challenge submissions.
 *  - Free builders: max FREE_TIER_MONTHLY_FOUNDER_LIMIT founder challenge submissions/month.
 */
export async function checkBuilderSubmissionLimit(
  builderId: string,
  isAdminChallenge: boolean
): Promise<BuilderLimitResult> {
  // Admin challenges are always free — bypass all limits
  if (isAdminChallenge) {
    return {
      allowed: true,
      tier: "free",
      founderSubmissionsThisMonth: 0,
      monthlyLimit: Infinity,
    };
  }

  const sub = await getBuilderSubscription(builderId);

  if (sub.status === "restricted") {
    return {
      allowed: false,
      tier: "free",
      founderSubmissionsThisMonth: 0,
      monthlyLimit: FREE_TIER_MONTHLY_FOUNDER_LIMIT,
      reason:
        "Your account has been restricted to the free plan. Upgrade to Builder Pro to continue competing in founder challenges.",
    };
  }

  if (sub.tier === "pro") {
    return {
      allowed: true,
      tier: "pro",
      founderSubmissionsThisMonth: 0,
      monthlyLimit: Infinity,
    };
  }

  // Free tier: count how many distinct founder-posted challenges they've submitted to this month
  const startOfMonth = getStartOfCurrentMonth();

  const submissionsQuery = query(
    collection(db, "submissions"),
    where("talentId", "==", builderId),
    where("submittedAt", ">=", startOfMonth)
  );

  const submSnap = await getDocs(submissionsQuery);
  const uniqueChallengeIds = [
    ...new Set(submSnap.docs.map((d) => d.data().challengeId as string)),
  ];

  let founderChallengeCount = 0;
  await Promise.all(
    uniqueChallengeIds.map(async (challengeId) => {
      try {
        const cSnap = await getDoc(doc(db, "challenges", challengeId));
        if (cSnap.exists() && !cSnap.data().postedByAdmin) {
          founderChallengeCount++;
        }
      } catch {
        // ignore individual errors
      }
    })
  );

  if (founderChallengeCount >= FREE_TIER_MONTHLY_FOUNDER_LIMIT) {
    return {
      allowed: false,
      tier: "free",
      founderSubmissionsThisMonth: founderChallengeCount,
      monthlyLimit: FREE_TIER_MONTHLY_FOUNDER_LIMIT,
      reason: `Free plan builders can compete in up to ${FREE_TIER_MONTHLY_FOUNDER_LIMIT} founder challenges per month. Upgrade to Builder Pro for unlimited access!`,
    };
  }

  return {
    allowed: true,
    tier: "free",
    founderSubmissionsThisMonth: founderChallengeCount,
    monthlyLimit: FREE_TIER_MONTHLY_FOUNDER_LIMIT,
  };
}

/**
 * Monthly subscription audit for a builder.
 * Call on dashboard load / login.
 *
 * - Pro active  → ensure accountRestricted=false, update cycle date if new month
 * - Pro expired → downgrade to free, set accountRestricted=true, update cycle date
 */
export async function auditBuilderSubscriptionStatus(builderId: string): Promise<{
  wasRestricted: boolean;
  currentTier: BuilderTier;
}> {
  try {
    const userRef = doc(db, "users", builderId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return { wasRestricted: false, currentTier: "free" };

    const data = userSnap.data();
    const plan = (data.plan || data.tier || data.subscriptionTier || "free").toLowerCase();
    const endDate: string | null = data.subscriptionEndDate || null;
    const storedCycleStart: string | null = data.cycleStartDate || null;
    const currentCycleStart = getStartOfCurrentMonth();

    const isNewMonth =
      !storedCycleStart ||
      new Date(storedCycleStart).getTime() < new Date(currentCycleStart).getTime();

    const proExpired = endDate && new Date(endDate).getTime() < Date.now();

    if (plan === "pro" && !proExpired) {
      const updates: Record<string, unknown> = { accountRestricted: false };
      if (isNewMonth) updates.cycleStartDate = currentCycleStart;
      await updateDoc(userRef, updates);
      return { wasRestricted: false, currentTier: "pro" };
    }

    // Expired or never Pro
    const updates: Record<string, unknown> = {
      subscriptionTier: "free",
      plan: "free",
      subscriptionStatus: "expired",
      accountRestricted: true,
    };
    if (isNewMonth) updates.cycleStartDate = currentCycleStart;
    await updateDoc(userRef, updates);
    return { wasRestricted: true, currentTier: "free" };
  } catch (err) {
    console.error("Builder subscription audit failed:", err);
    return { wasRestricted: false, currentTier: "free" };
  }
}

/**
 * Returns live monthly founder-challenge submission count for the dashboard meter.
 */
export async function getBuilderMonthlyFounderSubmissionCount(
  builderId: string
): Promise<number> {
  try {
    const startOfMonth = getStartOfCurrentMonth();
    const submissionsQuery = query(
      collection(db, "submissions"),
      where("talentId", "==", builderId),
      where("submittedAt", ">=", startOfMonth)
    );
    const submSnap = await getDocs(submissionsQuery);
    const uniqueChallengeIds = [
      ...new Set(submSnap.docs.map((d) => d.data().challengeId as string)),
    ];

    let founderCount = 0;
    await Promise.all(
      uniqueChallengeIds.map(async (cid) => {
        try {
          const cSnap = await getDoc(doc(db, "challenges", cid));
          if (cSnap.exists() && !cSnap.data().postedByAdmin) founderCount++;
        } catch {
          // ignore
        }
      })
    );
    return founderCount;
  } catch {
    return 0;
  }
}
