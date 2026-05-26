"use client";

import { motion } from "framer-motion";
import { Plus, Users, Trophy, Swords, ArrowUpRight, MessageSquare, Loader2, Building2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useFounderStats, useFounderChallenges } from "@/hooks/use-challenges";
import type { FounderProfile } from "@/hooks/use-profile";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FounderOverview = () => {
  const { user } = useAuth();
  const { profile, profileLoading } = useProfile();
  const { data: founderStats } = useFounderStats(user?.uid);
  const { data: challenges, isLoading: challengesLoading } = useFounderChallenges(user?.uid);

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const p = profile as FounderProfile | null;
  const founderName   = p?.name ?? user?.displayName ?? "Founder";
  const firstName     = founderName.split(" ")[0];
  const companyName   = p?.companyName ?? "Your Company";
  const companyWeb    = p?.companyWebsite ?? "";
  const bio           = p?.bio ?? "";
  const industry      = p?.industry ?? "";
  const location      = p?.location ?? "";

  const stats = [
    { label: "Active Challenges",    value: founderStats?.activeChallenges ?? 0, icon: Swords,        color: "text-primary",      gradient: "from-primary/10 to-primary/5" },
    { label: "Total Challenges",     value: founderStats?.totalChallenges ?? 0, icon: Trophy,        color: "text-yellow-400",   gradient: "from-yellow-400/10 to-yellow-400/5" },
    { label: "Engaged Builders",     value: "—", icon: Users,         color: "text-accent",       gradient: "from-accent/10 to-accent/5" },
    { label: "Total Monetary Rewards", value: (founderStats as { totalRewardValue?: string } | undefined)?.totalRewardValue ?? founderStats?.totalPrize ?? "$0", icon: Globe, color: "text-blue-400", gradient: "from-blue-400/10 to-blue-400/5" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome, <span className="gradient-text">{firstName}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Building2 size={14} className="text-muted-foreground" />
            <p className="text-muted-foreground text-sm font-semibold">{companyName}</p>
            {industry && (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                {industry}
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
              p?.subscriptionTier === 'pro' 
                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30" 
                : "bg-muted text-muted-foreground"
            }`}>
              {p?.subscriptionTier === 'pro' ? 'Founder Pro' : 'Starter Trial'}
            </span>
            {p?.subscriptionTier !== 'pro' && (
              <span className="text-[10px] text-muted-foreground font-medium">
                ({1 - (p?.challengeCount ?? 0)}/1 challenge left)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <Link to={`/profile/${user.uid}`}>
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary h-11 px-6">
                View Public Profile
              </Button>
            </Link>
          )}
          <Link to="/dashboard/founder/challenges/create">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-11 px-6">
              <Plus size={18} className="mr-2" />
              Post New Challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* Company info card */}
      {(bio || location || companyWeb) && (
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass p-5 border border-primary/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
              <div className="flex flex-wrap gap-4 mt-3">
                {location && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    📍 {location}
                  </span>
                )}
                {companyWeb && (
                  <a
                    href={companyWeb.startsWith("http") ? companyWeb : `https://${companyWeb}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <Globe size={12} /> {companyWeb}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={`glass p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground relative z-10">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">Post challenges to track</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Challenges List or CTA */}
      {challengesLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : challenges && challenges.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xl text-foreground mt-8">Your Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="glass p-5 flex flex-col h-full border border-primary/10">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    challenge.status === 'Completed' ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'
                  }`}>
                    {challenge.status}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{challenge.currentParticipants} submissions</span>
                </div>
                <h4 className="font-heading font-semibold text-foreground mb-1 line-clamp-1">{challenge.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{challenge.description}</p>
                <Link to={`/dashboard/founder/challenges/${challenge.id}/manage`}>
                  <Button variant="outline" className="w-full text-xs h-8 border-border hover:bg-secondary">
                    Manage Submissions
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass p-8 text-center border border-dashed border-primary/30 mt-8"
        >
          <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
            <Swords size={28} className="text-primary" />
          </div>
          <h3 className="font-heading font-bold text-xl text-foreground mb-2">
            Post your first challenge
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Attract top builders to solve real problems for your startup. Set your reward type, define requirements, and watch the submissions roll in.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/dashboard/founder/challenges/create">
              <Button className="bg-primary hover:bg-primary/90 h-11 px-8">
                <Plus size={18} className="mr-2" /> Post a Challenge
              </Button>
            </Link>
            <Link to="/dashboard/founder/founders">
              <Button variant="outline" className="border-border h-11 px-6 flex items-center gap-2">
                Discover Talent <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FounderOverview;
