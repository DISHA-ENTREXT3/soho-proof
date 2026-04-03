"use client";

import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  Trophy, 
  Zap, 
  Star, 
  Building2, 
  Globe, 
  ArrowLeft,
  Github,
  Twitter,
  Linkedin,
  MapPin,
  Calendar,
  ExternalLink,
  Flame,
  Swords
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

// Mock data for profiles - in a real app, this would be fetched from the API
interface Profile {
  type: "talent" | "founder";
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  joined: string;
  role?: string;
  level?: string;
  xp?: number;
  reputation?: string;
  skills?: { name: string; level: number }[];
  badges?: string[];
  achievements?: number;
  streak?: number;
  company?: string;
  industry?: string;
  website?: string;
  totalAwarded?: string;
  activeChallenges?: number;
  completedChallenges?: number;
}

const mockProfiles: Record<string, Profile> = {
  "alex-rivera": {
    type: "talent",
    name: "Alex Rivera",
    username: "arivera",
    avatar: "AR",
    role: "Legend Hunter",
    level: "Legend",
    xp: 8420,
    reputation: "Elite (Top 1%)",
    bio: "Full-stack developer focused on building scalable web applications. Passionate about real-time systems and UX.",
    location: "San Francisco, CA",
    joined: "March 2024",
    skills: [
      { name: "Frontend", level: 95 },
      { name: "Backend", level: 88 },
      { name: "UI/UX", level: 82 },
    ],
    badges: ["Top 10", "Challenge Winner", "Early Adopter"],
    achievements: 12,
    streak: 14
  },
  "jane-cooper": {
    type: "founder",
    name: "Jane Cooper",
    username: "janecoop",
    company: "Acme Corp",
    avatar: "🏢",
    industry: "AI & SaaS",
    website: "https://acme.ai",
    bio: "Founder of Acme Corp. We're building the next generation of AI tools for creators. Looking for top engineering talent.",
    location: "Austin, TX",
    joined: "June 2024",
    totalAwarded: "$45,000",
    activeChallenges: 3,
    completedChallenges: 18,
  }
};

const PublicProfile = () => {
  const { id } = useParams();
  // Fallback to alex-rivera if no match (for demo)
  const profile = mockProfiles[id as string] || mockProfiles["alex-rivera"];
  const isFounder = profile.type === "founder";

  return (
    <div className="relative min-h-screen bg-background font-body">
      <InfiniteGrid className="opacity-40" />
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[40%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-5xl">
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass p-8 text-center border-primary/20">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center text-3xl shadow-xl shadow-primary/20 text-white font-bold">
                {profile.avatar}
              </div>
              
              <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{profile.name}</h1>
              <p className="text-sm text-primary font-medium mb-4">@{profile.username}</p>
              
              <div className="flex justify-center gap-4 mb-6">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                  <Github size={18} className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                  <Twitter size={18} className="text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 border border-border">
                  <Linkedin size={18} className="text-muted-foreground" />
                </Button>
              </div>

              <div className="space-y-3 pt-6 border-t border-border text-left">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar size={14} className="text-primary" />
                  Joined {profile.joined}
                </div>
                {isFounder && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Globe size={14} className="text-primary" />
                    <a href={profile.website} target="_blank" className="hover:text-primary transition-colors underline decoration-primary/30">
                      {profile.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Talent-only Badges */}
            {!isFounder && profile.badges && (
               <div className="glass p-6 border-primary/20">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Top Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((b: string) => (
                    <Badge key={b} className="bg-primary/20 text-primary border-primary/30 py-1 px-3">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Header / Stats Overlay */}
            <div className="glass p-8 border-primary/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 {isFounder ? <Building2 size={120} /> : <Trophy size={120} />}
               </div>
               
               <h2 className="text-xl font-heading font-bold text-foreground mb-4">About</h2>
               <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                 {profile.bio}
               </p>

               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                 {isFounder ? (
                   <>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Total Awarded</p>
                      <p className="text-2xl font-heading font-extrabold text-primary">{profile.totalAwarded}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Challenges</p>
                      <p className="text-2xl font-heading font-extrabold text-foreground">{profile.completedChallenges}</p>
                    </div>
                   </>
                 ) : (
                   <>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Experience</p>
                      <p className="text-2xl font-heading font-extrabold text-primary">{profile.xp.toLocaleString()} XP</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Wins</p>
                      <p className="text-2xl font-heading font-extrabold text-foreground">{profile.achievements}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Streak</p>
                      <p className="text-2xl font-heading font-extrabold text-orange-400">
                        {profile.streak} <Flame className="inline ml-1 h-5 w-5" />
                      </p>
                    </div>
                   </>
                 )}
               </div>
            </div>

            {/* Talent Specific: Skills & Graphs */}
            {!isFounder && (
              <div className="glass p-8 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold text-foreground">Skill Matrix</h3>
                  <Badge className="bg-accent/20 text-accent border-accent/30">{profile.reputation}</Badge>
                </div>
                <div className="space-y-6">
                  {profile.skills?.map((s) => (
                    <div key={s.name} className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="font-medium text-foreground">{s.name}</span>
                         <span className="text-muted-foreground">{s.level}% Mastery</span>
                       </div>
                       <Progress value={s.level} className="h-2 bg-secondary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Founder Specific: Active Needs */}
            {isFounder && (
              <div className="glass p-8 border-primary/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold text-foreground">Open Challenges</h3>
                  <Link to="/dashboard/challenges">
                    <Button variant="link" className="text-primary p-0 h-auto font-bold flex items-center gap-1 group">
                      View all <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[1, 2].map((c) => (
                    <div key={c} className="p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 transition-all border border-transparent hover:border-primary/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Swords size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">Critical Bug Fix: Real-time UI</h4>
                          <p className="text-xs text-muted-foreground">React • TypeScript • $1,200 Reward</p>
                        </div>
                      </div>
                      <Link to="/dashboard/challenges/123">
                        <Button size="sm" variant="outline" className="text-xs border-border">Join</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Action */}
            <div className="text-center pt-8">
              {isFounder ? (
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-14 px-10 rounded-full text-lg shadow-xl">
                  Contact Founder
                </Button>
              ) : (
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-14 px-10 rounded-full text-lg shadow-xl">
                  Message Alpha Builder
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
