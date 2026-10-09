import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, CheckCircle2, Users, Trophy, Building2, Loader2, Sparkles, Code2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Animated counting number
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => (
  <motion.span
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {value.toLocaleString()}{suffix}
  </motion.span>
);

const SOCIAL_PROOF_AVATARS = [
  { color: "bg-primary", label: "A" },
  { color: "bg-blue-500", label: "S" },
  { color: "bg-purple-500", label: "R" },
  { color: "bg-orange-500", label: "M" },
  { color: "bg-emerald-500", label: "K" },
];

type RoleType = "tech" | "creator" | "founder";

const ROLE_CONFIGS: Record<RoleType, {
  label: string;
  badge: string;
  icon: typeof Code2;
  colorClass: string;
  glowColor: string;
  activeClass: string;
  tagline: string;
  placeholder: string;
  cta: string;
  skills: string[];
  floatLeft: {
    type: "code" | "stats" | "challenge";
    title: string;
    codeSnippet?: string[];
    statVal?: string;
    statLabel?: string;
    badge: string;
  };
  floatRight: {
    name: string;
    role: string;
    avatar: string;
    metric: string;
    metricLabel: string;
    status: string;
  };
}> = {
  tech: {
    label: "Tech & Product",
    badge: "Developers & AI Engineers",
    icon: Code2,
    colorClass: "text-primary",
    glowColor: "from-primary/15 via-cyan-500/5 to-transparent",
    activeClass: "bg-primary/20 border-primary/60 text-primary shadow-glow-sm",
    tagline: "SOHO drops a free challenge every Monday to build your rank. Founder challenges are where the real hiring & bounties happen.",
    placeholder: "Enter developer email (e.g. dev@domain.com)...",
    cta: "Join as Tech Builder →",
    skills: ["Full-Stack", "AI Agents", "APIs & Systems", "Mobile Dev"],
    floatLeft: {
      type: "code",
      title: "agent_runner.ts",
      codeSnippet: [
        "const agent = new SohoAgent({",
        "  role: 'AI_Researcher',",
        "  accuracy: 0.99",
        "});",
        "await agent.solveChallenge();",
      ],
      badge: "● Tests Passing (100%)",
    },
    floatRight: {
      name: "Alex Rivera",
      role: "Lead Full-Stack Builder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      metric: "2,450 XP",
      metricLabel: "#1 Global Rank",
      status: "Verified Builder",
    },
  },
  creator: {
    label: "Growth & Creators",
    badge: "Marketers, Designers & Creators",
    icon: Rocket,
    colorClass: "text-purple-400",
    glowColor: "from-purple-500/15 via-pink-500/5 to-transparent",
    activeClass: "bg-purple-500/20 border-purple-400/60 text-purple-300 shadow-glow-sm",
    tagline: "Weekly SOHO briefs keep your portfolio sharp & your rank climbing. Founder briefs bring real brand deals & career opportunities.",
    placeholder: "Enter creator/growth email...",
    cta: "Join as Growth Creator →",
    skills: ["Viral Content", "Growth Hacking", "UI/UX Design", "Social Media"],
    floatLeft: {
      type: "stats",
      title: "Campaign Impact",
      statVal: "142.8K",
      statLabel: "Organic Impressions (30 Days)",
      badge: "+340% Growth Spike",
    },
    floatRight: {
      name: "Sarah Chen",
      role: "Growth & Viral Strategist",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      metric: "18.4K",
      metricLabel: "Total Shares",
      status: "Top 1% Creator",
    },
  },
  founder: {
    label: "Founders & Teams",
    badge: "Startups & Hiring Leads",
    icon: Building2,
    colorClass: "text-blue-400",
    glowColor: "from-blue-500/15 via-emerald-500/5 to-transparent",
    activeClass: "bg-blue-500/20 border-blue-400/60 text-blue-300 shadow-glow-sm",
    tagline: "Post a founder challenge. Builders & creators compete. Hire whoever delivers best — no CV screening rounds.",
    placeholder: "Enter work/company email...",
    cta: "Post Challenge & Hire →",
    skills: ["Zero Fluff", "Verified Proof", "Top 1% Talent", "Rapid Hiring"],
    floatLeft: {
      type: "challenge",
      title: "Active Challenge",
      statVal: "$1,500 Bounty",
      statLabel: "Build AI Search Extension",
      badge: "14 Submissions Received",
    },
    floatRight: {
      name: "TechCorp Labs",
      role: "Y-Combinator S24 Startup",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
      metric: "48 Hours",
      metricLabel: "Avg Time-to-Hire",
      status: "Verified Founder",
    },
  },
};

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleType>("tech");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  const activeConfig = ROLE_CONFIGS[role];

  const handleJoinWaitlist = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const existing = await getDocs(
        query(collection(db, "waitlist"), where("email", "==", trimmed))
      );
      if (!existing.empty) {
        toast({ title: "You're already on the list! 🎉", description: "We'll reach out soon." });
        setJoined(true);
        return;
      }

      await addDoc(collection(db, "waitlist"), {
        email: trimmed,
        role: role,
        joinedAt: serverTimestamp(),
        source: "hero_multi_domain",
      });

      setJoined(true);
      toast({
        title: "You're in! 🚀",
        description: `Welcome to Soho Space (${activeConfig.label}). We'll be in touch soon!`,
      });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-20 pb-16">
      {/* Dynamic Morphing Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-radial ${activeConfig.glowColor} blur-3xl pointer-events-none -z-10`}
        />
      </AnimatePresence>

      {/* Floating Background Glass Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block">
        {/* Left Floating Card: Realistic Product Snippet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`left-${role}`}
            initial={{ opacity: 0, x: -40, y: 0 }}
            animate={{ opacity: 0.95, x: 0, y: [0, -10, 0] }}
            exit={{ opacity: 0, x: -30 }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.4 },
              x: { duration: 0.4 },
            }}
            className="absolute top-1/4 left-6 xl:left-12 w-80 glass p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            {activeConfig.floatLeft.type === "code" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-muted-foreground ml-1.5">{activeConfig.floatLeft.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    {activeConfig.floatLeft.badge}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground/90 space-y-0.5 pt-1 text-left">
                  {activeConfig.floatLeft.codeSnippet?.map((line, idx) => (
                    <p key={idx} className="leading-snug">
                      <span className="text-muted-foreground/40 select-none mr-2">{idx + 1}</span>
                      <span className={idx === 0 ? "text-primary font-semibold" : idx === 4 ? "text-purple-300" : "text-foreground/80"}>
                        {line}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {activeConfig.floatLeft.type === "stats" && (
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">{activeConfig.floatLeft.title}</span>
                  <span className="text-[10px] text-purple-300 font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30">
                    {activeConfig.floatLeft.badge}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-heading font-extrabold text-foreground tracking-tight">{activeConfig.floatLeft.statVal}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeConfig.floatLeft.statLabel}</p>
                </div>
                <div className="w-full h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[82%]" />
                </div>
              </div>
            )}

            {activeConfig.floatLeft.type === "challenge" && (
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">{activeConfig.floatLeft.title}</span>
                  <span className="text-[10px] text-blue-300 font-bold px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
                    {activeConfig.floatLeft.badge}
                  </span>
                </div>
                <p className="text-xl font-heading font-bold text-foreground">{activeConfig.floatLeft.statVal}</p>
                <p className="text-xs text-muted-foreground">{activeConfig.floatLeft.statLabel}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right Floating Card: Authentic Profile & Reputation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`right-${role}`}
            initial={{ opacity: 0, x: 40, y: 0 }}
            animate={{ opacity: 0.95, x: 0, y: [0, 10, 0] }}
            exit={{ opacity: 0, x: 30 }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.4 },
              x: { duration: 0.4 },
            }}
            className="absolute top-1/4 right-6 xl:right-12 w-76 glass p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={activeConfig.floatRight.avatar}
                alt={activeConfig.floatRight.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-foreground truncate">{activeConfig.floatRight.name}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">{activeConfig.floatRight.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40 border border-border/50">
              <div>
                <p className="text-xs font-semibold text-foreground">{activeConfig.floatRight.metric}</p>
                <p className="text-[10px] text-muted-foreground">{activeConfig.floatRight.metricLabel}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30">
                {activeConfig.floatRight.status}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle border border-primary/20 text-xs text-primary font-semibold mb-6"
          >
            <Sparkles size={12} className="animate-pulse" />
            Proof-of-Work Ecosystem for Tech, Growth & Creators
          </motion.div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 text-balance">
            Hire by <span className="gradient-text">Proof</span>
            <br />
            Not Promises
          </h1>

          {/* Dynamic Sub-headline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-5 text-balance">
            Founders post real challenges in <span className="text-foreground font-medium">Code, Growth, Content & Design</span>.
            <br className="hidden sm:block" />
            Talent executes. Real output wins. No résumés required.
          </p>

          {/* ── Mission Pill — above the fold ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/60 text-xs text-muted-foreground max-w-lg text-center leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <span>
                Not replacing the résumé —{" "}
                <span className="text-foreground font-medium">replacing the 8-round screening maze</span>.
                {" "}One proof-of-work. One decision. Your work speaks louder than any CV.
              </span>
            </div>
          </motion.div>

          {/* ── Interactive Multi-Domain Role Switcher ── */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="p-1 rounded-2xl glass border border-border/80 flex items-center justify-between gap-1 shadow-lg">
              {(["tech", "creator", "founder"] as RoleType[]).map((rKey) => {
                const conf = ROLE_CONFIGS[rKey];
                const Icon = conf.icon;
                const isActive = role === rKey;
                return (
                  <button
                    key={rKey}
                    onClick={() => setRole(rKey)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300",
                      isActive
                        ? conf.activeClass
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    )}
                  >
                    <Icon size={15} />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Micro Skill Badges for active tab */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {activeConfig.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary/50 border border-border/60 text-muted-foreground"
                >
                  ✦ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ── Email Capture Block ── */}
          <AnimatePresence mode="wait">
            {joined ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto glass rounded-2xl p-6 border border-emerald-400/30 text-center space-y-3"
              >
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <p className="font-heading font-bold text-lg">You're on the list! 🎉</p>
                <p className="text-sm text-muted-foreground">
                  We've reserved your early access spot for <strong>{activeConfig.label}</strong>.
                </p>
                <Link to="/community">
                  <Button variant="outline" size="sm" className="mt-2 border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10">
                    Explore Public Community →
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto space-y-4"
              >
                {/* Dynamic tagline for chosen role */}
                <p className="text-sm font-semibold text-foreground/90">
                  ⚡ {activeConfig.tagline}
                </p>

                {/* Email row */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder={activeConfig.placeholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleJoinWaitlist()}
                    className="h-12 rounded-xl bg-secondary/40 border-border/60 focus:border-primary/50 flex-1 text-sm px-4"
                  />
                  <Button
                    size="lg"
                    onClick={handleJoinWaitlist}
                    disabled={submitting}
                    className="h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-bold shrink-0"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>{activeConfig.cta} <ArrowRight className="ml-1" size={16} /></>
                    )}
                  </Button>
                </div>

                {/* Trust line */}
                <p className="text-[11px] text-muted-foreground">
                  Free to join · Weekly challenge drops every Monday · Top performers featured on the public leaderboard · Already registered?{" "}
                  <Link to="/auth" className="text-primary hover:underline font-medium">Sign in →</Link>
                </p>

                {/* Or divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or jump right in</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Quick CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary h-11 px-6 text-sm w-full">
                      Start Building / Creating Free
                    </Button>
                  </Link>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground h-11 px-6 text-sm w-full">
                      Post a Challenge →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Community Positioning Strip ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 space-y-5"
          >
            {/* Avatars + community tagline */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center">
                {SOCIAL_PROOF_AVATARS.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.08, type: "spring" }}
                    style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: 5 - i }}
                    className={`w-8 h-8 rounded-full ${a.color} ring-2 ring-background flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {a.label}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Be part of a{" "}
                <span className="font-semibold text-foreground">growing community</span>{" "}
                shaping the future of hiring
              </p>
            </div>

            {/* Stats row — real future-facing signals */}
            <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-primary" />
                <span className="font-medium text-foreground">Weekly</span> <span>challenge drops</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <Trophy size={13} className="text-yellow-400" />
                <span className="font-medium text-foreground">Top 100</span> <span>Builder leaderboard</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-blue-400" />
                <span className="font-medium text-foreground">Builders, Creators</span> <span>& Founders — one roof</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="font-medium text-foreground">Zero</span> <span>recruiting fees · ever</span>
              </span>
            </div>

            <SocialLinks />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
