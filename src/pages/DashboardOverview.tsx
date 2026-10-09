import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Swords, Star, Flame, TrendingUp, Zap, Loader2, Crown, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import type { TalentProfile } from "@/hooks/use-profile";
import { auditBuilderSubscriptionStatus, getBuilderMonthlyFounderSubmissionCount, FREE_TIER_MONTHLY_FOUNDER_LIMIT } from "@/lib/builder-subscription";

const XP_LEVELS = [
  { label: "Rookie",   min: 0,     max: 1000  },
  { label: "Builder",  min: 1000,  max: 3000  },
  { label: "Pro",      min: 3000,  max: 6000  },
  { label: "Elite",    min: 6000,  max: 10000 },
  { label: "Master",   min: 10000, max: 15000 },
  { label: "Legend",   min: 15000, max: 99999 },
];

function getLevel(xp: number) {
  return XP_LEVELS.find((l) => xp >= l.min && xp < l.max) ?? XP_LEVELS[0];
}

const statusColors: Record<string, string> = {
  Won:          "bg-primary/20 text-primary",
  "2nd Place":  "bg-yellow-400/20 text-yellow-400",
  "In Progress":"bg-blue-400/20 text-blue-400",
  Submitted:    "bg-accent/20 text-accent",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const { profile, profileLoading, initials } = useProfile();
  const [founderUsed, setFounderUsed] = useState(0);
  const [isRestricted, setIsRestricted] = useState(false);
  const [auditDone, setAuditDone] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    // Run monthly audit + load usage meter
    (async () => {
      const result = await auditBuilderSubscriptionStatus(user.uid);
      setIsRestricted(result.wasRestricted);
      const count = await getBuilderMonthlyFounderSubmissionCount(user.uid);
      setFounderUsed(count);
      setAuditDone(true);
    })();
  }, [user?.uid]);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const p = profile as TalentProfile | null;
  const firstName = p?.name?.split(" ")[0] ?? user?.displayName?.split(" ")[0] ?? "Builder";
  const xp      = p?.xp      ?? 0;
  const wins    = p?.wins    ?? 0;
  const streak  = p?.streak  ?? 0;
  const skills  = p?.skills  ?? [];

  const currentLevel = getLevel(xp);
  const nextLevel    = XP_LEVELS[XP_LEVELS.indexOf(currentLevel) + 1] ?? currentLevel;
  const xpProgress   = ((xp - currentLevel.min) / (nextLevel.max - currentLevel.min)) * 100;

  const stats = [
    { label: "Total XP",        value: xp.toLocaleString(),      icon: Zap,    change: "earned in challenges",  color: "text-primary" },
    { label: "Challenges Won",  value: String(wins),              icon: Trophy, change: "all-time",             color: "text-yellow-400" },
    { label: "Level",           value: currentLevel.label,        icon: Star,   change: "keep earning XP",      color: "text-accent" },
    { label: "Streak",          value: `${streak} days`,          icon: Flame,  change: "stay consistent!",     color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">{firstName}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground text-sm">Here's your performance snapshot.</p>
            {(() => {
              const userEmail = user?.email?.toLowerCase() || "";
              const isAdmin = userEmail.endsWith("@entrext.com") || userEmail.endsWith("@entrext.in") || userEmail.includes("entrext") || (p?.role as string) === "admin";
              const isPro = p?.subscriptionTier === "pro" || isAdmin;

              return (
                <>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                    isAdmin
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : isPro
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : isRestricted
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {isAdmin ? "Admin Pro" : isPro ? "Builder Pro" : isRestricted ? "Restricted" : "Explorer Free"}
                  </span>
                  {!isPro && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      ({Math.max(0, FREE_TIER_MONTHLY_FOUNDER_LIMIT - founderUsed)}/{FREE_TIER_MONTHLY_FOUNDER_LIMIT} founder entries left this month)
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
        {user && (
          <Link to={`/profile/${user.uid}`}>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary h-11 px-6">
              View Public Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="glass p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-semibold text-foreground">Level Progress</h3>
            <p className="text-xs text-muted-foreground">{currentLevel.label} → {nextLevel.label}</p>
          </div>
          <span className="text-sm font-medium text-primary">{xp.toLocaleString()} / {nextLevel.max.toLocaleString()} XP</span>
        </div>
        <Progress value={Math.min(xpProgress, 100)} className="h-3 bg-secondary" />
        <p className="text-xs text-muted-foreground mt-2">
          {(nextLevel.max - xp).toLocaleString()} XP to reach {nextLevel.label}
        </p>
      </motion.div>

      {/* Founder Challenge Monthly Meter */}
      {auditDone && (
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className={`glass p-5 border ${isRestricted ? "border-red-500/30" : p?.subscriptionTier === "pro" ? "border-primary/20" : "border-amber-500/20"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {p?.subscriptionTier === "pro"
                ? <Crown size={16} className="text-primary" />
                : isRestricted
                  ? <Lock size={16} className="text-red-400" />
                  : <ShieldCheck size={16} className="text-amber-400" />
              }
              <h3 className="font-heading font-semibold text-foreground">Founder Challenges</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">This Month</span>
            </div>
            {p?.subscriptionTier === "pro" ? (
              <span className="text-xs text-primary font-semibold">Unlimited ∞</span>
            ) : (
              <span className={`text-xs font-bold ${founderUsed >= FREE_TIER_MONTHLY_FOUNDER_LIMIT ? "text-red-400" : "text-amber-400"}`}>
                {founderUsed} / {FREE_TIER_MONTHLY_FOUNDER_LIMIT}
              </span>
            )}
          </div>

          {p?.subscriptionTier === "pro" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              <span>Builder Pro — compete in unlimited founder challenges every month.</span>
            </div>
          ) : isRestricted ? (
            <div className="space-y-3">
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <span className="font-semibold">Account Restricted:</span> Your Builder Pro subscription has expired. You can still participate in all SOHO admin challenges freely, but founder challenge entries are paused.
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Admin challenges (SOHO posted) are always free & unlimited.</p>
                <Link to="/pricing">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0">
                    <Crown size={12} className="mr-1" /> Renew Pro
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Progress
                value={(founderUsed / FREE_TIER_MONTHLY_FOUNDER_LIMIT) * 100}
                className="h-2.5 bg-secondary"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {founderUsed >= FREE_TIER_MONTHLY_FOUNDER_LIMIT
                    ? "Monthly limit reached — upgrade to continue."
                    : `${FREE_TIER_MONTHLY_FOUNDER_LIMIT - founderUsed} entries remaining · SOHO admin challenges are always unlimited.`}
                </p>
                {founderUsed >= FREE_TIER_MONTHLY_FOUNDER_LIMIT && (
                  <Link to="/pricing">
                    <Button size="sm" variant="outline" className="text-xs h-7 border-primary/30 text-primary shrink-0">
                      <Crown size={10} className="mr-1" /> Go Pro
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Your Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state for challenges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Swords size={16} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Recent Challenges</h3>
        </div>
        {xp === 0 ? (
          <div className="text-center py-8">
            <Swords size={32} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No challenges yet.</p>
            <Link to="/dashboard/challenges">
              <Button variant="outline" className="mt-4 h-9 text-sm border-primary/30 text-primary">
                Browse Challenges
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Challenge history coming soon.</p>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
