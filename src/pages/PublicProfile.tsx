"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Trophy, Zap, Building2, Globe, ArrowLeft,
  Github, Twitter, Linkedin, MapPin, Flame, Swords,
  Loader2, AlertCircle, Clock, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import type { TalentProfile, FounderProfile } from "@/hooks/use-profile";
import type { Challenge, ChallengeStatus } from "@/types/challenge";
import { useAuth } from "@/hooks/use-auth";

type ProfileData = (TalentProfile | FounderProfile) & { uid: string };

const statusColors: Record<ChallengeStatus, string> = {
  Open: "bg-primary/20 text-primary",
  "In Progress": "bg-blue-400/20 text-blue-400",
  Judging: "bg-amber-400/20 text-amber-400",
  Completed: "bg-muted text-muted-foreground",
};

const toIsoString = (value: unknown) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const normalizePublicChallenge = (id: string, data: Record<string, unknown>): Challenge => ({
  id,
  title: String(data.title ?? ""),
  description: String(data.description ?? ""),
  category: data.category as Challenge["category"],
  status: (data.status as ChallengeStatus) ?? "Open",
  difficulty: data.difficulty as Challenge["difficulty"],
  xpReward: Number(data.xpReward ?? 0),
  rewardType: (data.rewardType as Challenge["rewardType"]) ?? "Recognition",
  rewardLabel: String(data.rewardLabel ?? data.prize ?? ""),
  prize: typeof data.prize === "string" ? data.prize : undefined,
  deadline: toIsoString(data.deadline),
  maxParticipants: Number(data.maxParticipants ?? 0),
  currentParticipants: Number(data.currentParticipants ?? 0),
  founderId: String(data.founderId ?? ""),
  founderName: String(data.founderName ?? "Founder"),
  founderAvatar: String(data.founderAvatar ?? "F"),
  companyName: String(data.companyName ?? ""),
  scoringCriteria: Array.isArray(data.scoringCriteria) ? data.scoringCriteria as Challenge["scoringCriteria"] : [],
  criteria: Array.isArray(data.criteria) ? data.criteria as Challenge["criteria"] : undefined,
  requirements: Array.isArray(data.requirements) ? data.requirements as string[] : [],
  createdAt: toIsoString(data.createdAt),
});

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [founderChallenges, setFounderChallenges] = useState<Challenge[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }

    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "users", id));
        if (snap.exists()) {
          const profileData = { uid: id, ...snap.data() } as ProfileData;
          setProfile(profileData);

          if (profileData.role === "founder") {
            setChallengesLoading(true);
            const challengesQuery = query(
              collection(db, "challenges"),
              where("founderId", "==", id),
              orderBy("createdAt", "desc"),
            );
            const challengeSnap = await getDocs(challengesQuery);
            setFounderChallenges(
              challengeSnap.docs.map((challengeDoc) => normalizePublicChallenge(challengeDoc.id, challengeDoc.data())),
            );
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setChallengesLoading(false);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-heading font-semibold text-foreground">Profile not found</p>
        <Link to="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
      </div>
    );
  }

  const isFounder = profile.role === "founder";
  const fp = profile as FounderProfile;
  const tp = profile as TalentProfile;

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const socialLink = (url: string | undefined, base = "") =>
    url ? (url.startsWith("http") ? url : `${base}${url}`) : null;

  const githubUrl  = !isFounder ? socialLink(tp.github)   : null;
  const twitterUrl = socialLink(profile.twitter);
  const linkedinUrl= isFounder  ? socialLink(fp.linkedin)  : null;
  const website    = isFounder  ? fp.companyWebsite : !isFounder ? tp.portfolio : null;

  return (
    <div className="relative min-h-screen bg-background font-body">
      <InfiniteGrid className="opacity-40" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[40%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-5xl">
        <Link
          to={isFounder ? "/dashboard/founder" : "/dashboard"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-8"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: identity card ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass p-8 text-center border-primary/20">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center text-3xl shadow-xl shadow-primary/20 text-white font-bold">
                {initials}
              </div>

              <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{profile.name}</h1>

              {isFounder && fp.companyName && (
                <p className="text-sm text-primary font-semibold mb-1 flex items-center justify-center gap-1">
                  <Building2 size={13} /> {fp.companyName}
                </p>
              )}
              {isFounder && fp.industry && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  {fp.industry}
                </span>
              )}
              {!isFounder && tp.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {tp.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{s}</span>
                  ))}
                </div>
              )}

              {/* Social links */}
              <div className="flex justify-center gap-3 mt-5 mb-6">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                      <Github size={16} className="text-muted-foreground" />
                    </Button>
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl.startsWith("@") ? `https://twitter.com/${twitterUrl.slice(1)}` : twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                      <Twitter size={16} className="text-muted-foreground" />
                    </Button>
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                      <Linkedin size={16} className="text-muted-foreground" />
                    </Button>
                  </a>
                )}
              </div>

              {/* Meta */}
              <div className="space-y-3 pt-6 border-t border-border text-left">
                {profile.location && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-primary flex-shrink-0" />
                    {profile.location}
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Globe size={14} className="text-primary flex-shrink-0" />
                    <a
                      href={website.startsWith("http") ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors underline decoration-primary/30 truncate"
                    >
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Right: main content ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* About + Stats */}
            <div className="glass p-8 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                {isFounder ? <Building2 size={120} /> : <Trophy size={120} />}
              </div>

              <h2 className="text-xl font-heading font-bold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {profile.bio || "No bio added yet."}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {isFounder ? (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Company</p>
                      <p className="text-xl font-heading font-extrabold text-primary">{fp.companyName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Industry</p>
                      <p className="text-xl font-heading font-extrabold text-foreground">{fp.industry || "—"}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Total XP</p>
                      <p className="text-2xl font-heading font-extrabold text-primary flex items-center gap-1">
                        <Zap size={18} /> {(tp.xp ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Wins</p>
                      <p className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-1">
                        <Trophy size={18} className="text-yellow-400" /> {tp.wins ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Streak</p>
                      <p className="text-2xl font-heading font-extrabold text-orange-400 flex items-center gap-1">
                        {tp.streak ?? 0} <Flame size={18} />
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Talent — skills */}
            {!isFounder && tp.skills?.length > 0 && (
              <div className="glass p-8 border-primary/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-heading font-bold text-foreground">Skills</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">{tp.level ?? "Rookie"}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Founder — empty state for challenges */}
            {isFounder && (
              <div className="glass p-8 border-primary/20">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-heading font-bold text-foreground">Public Challenges</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {founderChallenges.length}
                  </Badge>
                </div>

                {challengesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : founderChallenges.length === 0 ? (
                  <div className="text-center py-8">
                    <Swords size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No public challenges yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {founderChallenges.map((challenge) => {
                      const isOwnerFounder = user?.uid === profile.uid && role === "founder";
                      const challengeTarget = isOwnerFounder
                        ? `/dashboard/founder/challenges/${challenge.id}/manage`
                        : role === "talent"
                        ? `/dashboard/challenges/${challenge.id}`
                        : "/auth";

                      return (
                        <Link
                          key={challenge.id}
                          to={challengeTarget}
                          className="block rounded-lg border border-border bg-secondary/20 p-4 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`${statusColors[challenge.status]} border-0 text-xs`}>
                              {challenge.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{challenge.category}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{challenge.difficulty}</span>
                          </div>
                          <h4 className="font-heading font-semibold text-foreground mb-1">{challenge.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{challenge.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {new Date(challenge.deadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} /> {challenge.currentParticipants}/{challenge.maxParticipants}
                            </span>
                            <span className="flex items-center gap-1 text-primary">
                              <Zap size={12} /> {challenge.xpReward} XP
                            </span>
                            <span className="ml-auto font-semibold text-primary">
                              {isOwnerFounder ? "Manage Submissions" : challenge.rewardLabel || challenge.rewardType}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
