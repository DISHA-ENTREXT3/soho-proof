import { motion } from "framer-motion";
import { Trophy, Swords, Star, Flame, TrendingUp, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import type { TalentProfile } from "@/hooks/use-profile";

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
          <p className="text-muted-foreground text-sm mt-1">Here's your performance snapshot.</p>
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
