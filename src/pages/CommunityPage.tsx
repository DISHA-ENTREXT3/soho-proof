import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, Building2, Crown, Star, Zap, ArrowUpRight, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Builder {
  id: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  wins?: number;
  subscriptionTier?: string;
  featured?: boolean;
  badge?: string;
  weeklySpotlight?: boolean;
}

interface Founder {
  id: string;
  name: string;
  avatarUrl?: string;
  companyName?: string;
  website?: string;
  subscriptionTier?: string;
  featured?: boolean;
  badge?: string;
}

const levelLabel = (xp: number) => {
  const lvl = Math.floor(Math.sqrt(xp / 100)) + 1;
  if (lvl >= 10) return { label: "Legend", color: "text-yellow-400 bg-yellow-400/10" };
  if (lvl >= 8) return { label: "Master", color: "text-purple-400 bg-purple-400/10" };
  if (lvl >= 6) return { label: "Elite", color: "text-orange-400 bg-orange-400/10" };
  if (lvl >= 4) return { label: "Pro", color: "text-blue-400 bg-blue-400/10" };
  return { label: "Starter", color: "text-muted-foreground bg-secondary" };
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function CommunityPage() {
  const [spotlight, setSpotlight] = useState<Builder | null>(null);
  const [topBuilders, setTopBuilders] = useState<Builder[]>([]);
  const [featuredBuilders, setFeaturedBuilders] = useState<Builder[]>([]);
  const [featuredFounders, setFeaturedFounders] = useState<Founder[]>([]);
  const [challengeCountMap, setChallengeCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [usersSnap, challengesSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "challenges")),
        ]);

        const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as (Builder & Founder & { role: string })[];

        // Challenge count per founder
        const counts: Record<string, number> = {};
        challengesSnap.docs.forEach(d => {
          const fid = d.data().founderId as string;
          if (fid) counts[fid] = (counts[fid] || 0) + 1;
        });
        setChallengeCountMap(counts);

        const builders = users.filter(u => u.role === "talent");
        const founders = users.filter(u => u.role === "founder");

        builders.sort((a, b) => (b.xp || 0) - (a.xp || 0));

        setSpotlight(builders.find(b => b.weeklySpotlight) || null);
        setTopBuilders(builders.slice(0, 10));
        setFeaturedBuilders(builders.filter(b => b.featured));
        setFeaturedFounders(founders.filter(f => f.featured));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav bar */}
      <nav className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-lg tracking-tight flex items-center gap-2">
            <Zap size={20} className="text-primary" /> Soho Space
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/auth" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <Users size={14} /> Builder Community
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold">
            Meet the <span className="text-gradient">Builders</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Top performers, featured founders, and rising stars shaping the future of real-skill hiring on Soho Space.
          </p>
        </motion.div>

        {/* Weekly Spotlight */}
        {spotlight && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative glass rounded-3xl p-8 md:p-12 border border-yellow-400/20 overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-yellow-400/30">
                  <AvatarImage src={spotlight.avatarUrl} />
                  <AvatarFallback className="text-2xl font-bold">{spotlight.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-2 -right-2 text-2xl">👑</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">Builder of the Week</p>
                <h2 className="font-heading text-3xl font-bold mb-2">{spotlight.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${levelLabel(spotlight.xp || 0).color}`}>
                    {levelLabel(spotlight.xp || 0).label}
                  </span>
                  <span className="text-sm text-muted-foreground">{(spotlight.xp || 0).toLocaleString()} XP</span>
                  <span className="text-sm text-muted-foreground">{spotlight.wins || 0} wins</span>
                  {spotlight.badge && (
                    <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">{spotlight.badge}</span>
                  )}
                </div>
              </div>
              <Link
                to={`/profile/${spotlight.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-sm font-medium transition-all"
              >
                View Profile <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.section>
        )}

        {/* Top 10 Builder Leaderboard */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Trophy size={22} className="text-primary" />
            <h2 className="font-heading text-2xl font-bold">Builder Leaderboard</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass h-16 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
              {topBuilders.map((builder, index) => {
                const lvl = levelLabel(builder.xp || 0);
                const rank = index + 1;
                return (
                  <motion.div key={builder.id} variants={item}>
                    <Link
                      to={`/profile/${builder.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl glass hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      {/* Rank */}
                      <div className="w-8 text-center">
                        {rank === 1 && <Crown size={20} className="text-yellow-400 mx-auto" />}
                        {rank === 2 && <span className="font-bold text-slate-300 text-lg">#2</span>}
                        {rank === 3 && <span className="font-bold text-orange-400 text-lg">#3</span>}
                        {rank > 3 && <span className="font-bold text-muted-foreground">#{rank}</span>}
                      </div>

                      {/* Avatar */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={builder.avatarUrl} />
                        <AvatarFallback className="text-sm font-semibold">{builder.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{builder.name}</p>
                          {builder.weeklySpotlight && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold">👑 Spotlight</span>}
                          {builder.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{builder.badge}</span>}
                          {builder.subscriptionTier === "pro" && <Badge className="bg-primary/20 text-primary border-0 text-[10px] py-0">Pro</Badge>}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex items-center gap-6 text-sm">
                        <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${lvl.color}`}>{lvl.label}</span>
                        <div className="text-right">
                          <p className="font-bold text-primary">{(builder.xp || 0).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">XP</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{builder.wins || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Wins</p>
                        </div>
                      </div>

                      <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* Featured Founders */}
        {(featuredFounders.length > 0 || loading) && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Building2 size={22} className="text-blue-400" />
              <h2 className="font-heading text-2xl font-bold">Featured Founders Hiring</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => <div key={i} className="glass h-40 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {featuredFounders.map(founder => (
                  <motion.div key={founder.id} variants={item}>
                    <Link
                      to={`/profile/${founder.id}`}
                      className="glass p-5 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-blue-400/30 hover:bg-blue-400/5 transition-all group"
                    >
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={founder.avatarUrl} />
                        <AvatarFallback className="text-base font-bold">{founder.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <p className="font-semibold text-sm">{founder.name}</p>
                          {founder.featured && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
                        </div>
                        {founder.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">{founder.badge}</span>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{founder.companyName || "Independent Founder"}</p>
                        <p className="text-xs text-blue-400 font-medium mt-1">
                          {challengeCountMap[founder.id] || 0} challenge{(challengeCountMap[founder.id] || 0) !== 1 ? "s" : ""} posted
                        </p>
                      </div>
                      <span className="text-[11px] text-primary group-hover:underline flex items-center gap-1">
                        View Profile <ArrowUpRight size={10} />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        )}

        {/* Featured Builders spotlight cards */}
        {(featuredBuilders.length > 0 || loading) && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Star size={22} className="text-yellow-400" />
              <h2 className="font-heading text-2xl font-bold">Soho Space Featured Builders</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(4).fill(0).map((_, i) => <div key={i} className="glass h-40 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {featuredBuilders.map(b => {
                  const lvl = levelLabel(b.xp || 0);
                  return (
                    <motion.div key={b.id} variants={item}>
                      <Link
                        to={`/profile/${b.id}`}
                        className="glass p-5 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                      >
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={b.avatarUrl} />
                          <AvatarFallback className="text-base font-bold">{b.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <p className="font-semibold text-sm">{b.name}</p>
                            {b.weeklySpotlight && <Crown size={12} className="text-yellow-400" />}
                          </div>
                          {b.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{b.badge}</span>
                          )}
                          <p className={`text-xs font-semibold mt-1 ${lvl.color.split(" ")[0]}`}>{lvl.label}</p>
                          <p className="text-xs text-muted-foreground">{(b.xp || 0).toLocaleString()} XP · {b.wins || 0} wins</p>
                        </div>
                        <span className="text-[11px] text-primary group-hover:underline flex items-center gap-1">
                          View Profile <ArrowUpRight size={10} />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        )}

        {/* CTA — Join the Community */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20"
        >
          {/* Ambient glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative glass p-12 md:p-16 text-center space-y-8">

            {/* Floating avatar ring — community preview */}
            <div className="flex justify-center">
              <div className="relative flex items-center">
                {[
                  { color: "bg-primary", label: "A" },
                  { color: "bg-blue-500", label: "S" },
                  { color: "bg-purple-500", label: "R" },
                  { color: "bg-orange-500", label: "M" },
                  { color: "bg-emerald-500", label: "K" },
                ].map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                    style={{ marginLeft: i === 0 ? 0 : "-10px", zIndex: 5 - i }}
                    className={`w-11 h-11 rounded-full ${a.color} ring-2 ring-background flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {a.label}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, type: "spring" }}
                  style={{ marginLeft: "-10px" }}
                  className="w-11 h-11 rounded-full bg-secondary ring-2 ring-background flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0"
                >
                  +{(topBuilders.length || 0) > 5 ? topBuilders.length - 5 : "∞"}
                </motion.div>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-3">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-sm font-bold uppercase tracking-widest text-primary"
              >
                Your People Are Already Here
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="font-heading text-4xl md:text-5xl font-bold leading-tight"
              >
                Sign up & become part of<br />
                <span className="text-gradient">something extraordinary.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.32 }}
                className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed"
              >
                A community where founders bring real problems, builders ship real solutions,
                and the best work speaks for itself — no résumé needed.
              </motion.p>
            </div>

            {/* Social proof pills */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {[
                { icon: "🏆", text: "Real challenges from real founders" },
                { icon: "⚡", text: "Ship. Get reviewed. Get hired." },
                { icon: "🌍", text: "Growing global community" },
                { icon: "🚀", text: "Founding member perks — limited spots" },
              ].map((pill, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.42 + i * 0.06 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-border text-sm text-muted-foreground"
                >
                  <span>{pill.icon}</span> {pill.text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/auth"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                <Zap size={18} className="group-hover:animate-pulse" />
                Join as Builder
                <span className="absolute -top-2.5 -right-2.5 text-[10px] px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-black uppercase tracking-wide leading-tight">Free</span>
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 hover:border-blue-400/60 font-bold text-base transition-all hover:scale-105 active:scale-95"
              >
                <Building2 size={18} />
                Post a Challenge as Founder
              </Link>
            </motion.div>

            <p className="text-xs text-muted-foreground">
              No credit card needed to start. 1-click Google sign-in.
            </p>

          </div>
        </motion.section>

      </div>
    </div>
  );
}
