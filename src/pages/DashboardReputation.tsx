import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Zap, 
  GitBranch, 
  Cpu, 
  Layers, 
  Globe, 
  ExternalLink,
  Award,
  CircleCheck,
  Dna,
  Share2,
  Download,
  Loader2
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useGlobalLeaderboard, useChallenges, useTalentSubmissions } from "@/hooks/use-challenges";
import { toast } from "@/hooks/use-toast";

const DashboardReputation = () => {
  const { user } = useAuth();
  const { profile, profileLoading } = useProfile();
  const { data: globalBoard } = useGlobalLeaderboard();
  const { data: submissions = [], isLoading: submissionsLoading } = useTalentSubmissions(user?.uid);
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges();
  const navigate = useNavigate();

  // Loading state
  if (profileLoading || submissionsLoading || challengesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Pre-calculations
  const xp = profile?.role === 'talent' ? profile.xp : 0;
  const trustScore = Math.min(99, 50 + Math.floor(xp / 100));
  const wins = profile?.role === 'talent' ? profile.wins : 0;
  const rank = globalBoard?.findIndex(u => u.uid === user?.uid) ?? -1;
  const rankDisplay = rank >= 0 ? `#${rank + 1}` : "Unranked";
  const xp24h = `+${Math.floor(xp * 0.05)}`; // Dynamic estimate based on total

  // Index challenges by ID for quick lookup
  const challengesMap = new Map(challenges.map(c => [c.id, c]));

  // 1. Skill Graph Calculation
  const skillData = (() => {
    const categoriesList = ["Tech", "Growth", "Hybrid", "Design", "Data"];
    const userSkills = profile?.role === 'talent' ? profile.skills || [] : [];
    
    // Keyword mappings to assign baseline capability scores
    const skillKeywords: Record<string, string[]> = {
      Tech: ["react", "typescript", "node", "firebase", "javascript", "html", "css", "next", "vite", "git", "backend", "frontend", "api", "database", "engineering", "dev"],
      Design: ["design", "ui", "ux", "figma", "tailwind", "css", "frontend", "graphic"],
      Data: ["data", "sql", "bigquery", "python", "machine learning", "ai", "analytics", "r", "pandas"],
      Growth: ["growth", "seo", "marketing", "product", "analytics", "hacker"],
      Hybrid: ["hybrid", "fullstack", "product manager", "scrum", "agile"]
    };

    // Calculate baseline scores (55 if profile matches registered skills, 20 otherwise)
    const categoryScores: Record<string, number> = {};
    categoriesList.forEach(cat => {
      const keywords = skillKeywords[cat] || [];
      const matches = userSkills.some(skill => 
        keywords.some(kw => skill.toLowerCase().includes(kw))
      );
      categoryScores[cat] = matches ? 55 : 20;
    });

    // Add score points based on real submission performance
    submissions.forEach(sub => {
      const challenge = challengesMap.get(sub.challengeId);
      if (!challenge) return;
      const cat = challenge.category || "Tech";
      
      if (sub.status === "Winner") {
        categoryScores[cat] = (categoryScores[cat] || 0) + 25;
      } else if (sub.status === "Reviewed") {
        const scoreBonus = Math.floor((sub.score || 0) * 0.15);
        categoryScores[cat] = (categoryScores[cat] || 0) + 5 + scoreBonus;
      } else {
        categoryScores[cat] = (categoryScores[cat] || 0) + 5;
      }
    });

    return categoriesList.map(cat => ({
      subject: cat,
      A: Math.min(100, categoryScores[cat]),
      fullMark: 100
    }));
  })();

  // 2. Dynamic Verification Badges
  const badges = (() => {
    const joinedDateStr = profile?.createdAt 
      ? new Date(profile.createdAt.toDate ? profile.createdAt.toDate() : profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : "—";

    const badgeList = [
      {
        name: "Early Builder",
        icon: Globe,
        status: "Verified",
        color: "text-blue-400",
        date: joinedDateStr
      }
    ];

    const hasSubmissions = submissions.length >= 1;
    const firstSubDate = submissions.length > 0
      ? new Date(submissions.map(s => new Date(s.submittedAt).getTime()).sort((a, b) => a - b)[0]).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : "—";
    badgeList.push({
      name: "First Attempt",
      icon: Zap,
      status: hasSubmissions ? "Verified" : "Pending",
      color: hasSubmissions ? "text-yellow-400" : "text-muted-foreground",
      date: firstSubDate
    });

    const hasWin = wins >= 1 || submissions.some(s => s.status === "Winner");
    const winSub = submissions.find(s => s.status === "Winner");
    const winDate = winSub 
      ? new Date(winSub.submittedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : "—";
    badgeList.push({
      name: "Elite Solver",
      icon: Award,
      status: hasWin ? "Verified" : "Pending",
      color: hasWin ? "text-accent" : "text-muted-foreground",
      date: winDate
    });

    const uniqueCategories = new Set(
      submissions
        .map(s => challengesMap.get(s.challengeId)?.category)
        .filter(Boolean)
    );
    const isPolymath = uniqueCategories.size >= 2;
    badgeList.push({
      name: "Polymath",
      icon: Cpu,
      status: isPolymath ? "Verified" : "Pending",
      color: isPolymath ? "text-emerald-400" : "text-muted-foreground",
      date: isPolymath ? "Verified" : "—"
    });

    return badgeList;
  })();

  // 3. Real Proof of Execution Timeline
  const timeline = (() => {
    return submissions.map(sub => {
      const challenge = challengesMap.get(sub.challengeId);
      const title = challenge?.title || `Challenge #${sub.challengeId.slice(0, 6)}`;
      const category = challenge?.category || "Tech";
      
      let eventName = "Submitted";
      let xpDisplay = "—";
      if (sub.status === "Winner") {
        eventName = "Submission Won";
        xpDisplay = `+${challenge?.xpReward || 1000} XP`;
      } else if (sub.status === "Reviewed") {
        eventName = `Reviewed (Score: ${sub.score || 0}/100)`;
        xpDisplay = `+100 XP`;
      } else {
        eventName = "Pending Review";
      }

      const dateStr = sub.submittedAt 
        ? new Date(sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : "—";

      return {
        title,
        event: eventName,
        date: dateStr,
        xp: xpDisplay,
        category,
        challengeId: sub.challengeId,
        rawDate: sub.submittedAt ? new Date(sub.submittedAt).getTime() : 0
      };
    }).sort((a, b) => b.rawDate - a.rawDate);
  })();

  return (
    <div className="max-w-7xl space-y-8 pb-10">
      {/* Header with quick stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Dna className="w-8 h-8 text-primary animate-pulse" />
             </div>
             <div>
                <h1 className="font-heading text-3xl font-bold">Talent <span className="gradient-text">DNA</span></h1>
                <p className="text-muted-foreground text-sm">Your verified proof-of-work identity.</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary rounded-full px-5" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Profile link copied", description: "Share your proof-of-work with the world." });
            }}>
              <Share2 className="w-4 h-4 mr-2" /> Share Profile
            </Button>
            <Button size="sm" variant="outline" className="glass rounded-full px-5 border-white/5" onClick={() => {
              toast({ title: "Exporting...", description: "Your JSON proof is being generated." });
            }}>
              <Download className="w-4 h-4 mr-2" /> Export JSON Proof
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { label: "Trust Score", value: `${trustScore}/100`, icon: ShieldCheck, color: "text-emerald-400" },
            { label: "Verifications", value: wins.toString(), icon: Award, color: "text-primary" },
            { label: "Global Rank", value: rankDisplay, icon: Globe, color: "text-accent" },
            { label: "XP / 24h", value: xp24h, icon: Zap, color: "text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass p-4 min-w-[140px]">
              <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
              <p className="text-xl font-heading font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Skill Proof Radar */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" /> Skill Graph
              </h3>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono">
                Real-time Sync
              </Badge>
            </div>

            <div className="h-[400px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  <Radar
                    name="Skill Proficiency"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 15, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Proof Timeline */}
          <div className="glass p-6">
            <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-accent" /> Proof of Execution
            </h3>
            {timeline.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground text-sm">No submissions recorded yet.</p>
                <Button 
                  variant="link" 
                  className="text-primary text-xs mt-2" 
                  onClick={() => navigate("/dashboard/challenges")}
                >
                  Browse Challenges
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10" />
                      {idx !== timeline.length - 1 && <div className="w-0.5 h-full bg-border/50 my-1" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h4 
                          className="text-sm font-bold group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                          onClick={() => navigate(`/dashboard/challenges/${item.challengeId}`)}
                        >
                          {item.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <span className="text-xs text-muted-foreground font-mono">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-primary font-medium">{item.event}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                        <span className="text-xs text-emerald-400 ml-auto font-mono">{item.xp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verification Badges Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 h-full flex flex-col">
            <h3 className="font-heading font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" /> Verification Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <motion.div 
                  key={badge.name}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl bg-secondary/30 border border-white/5 relative group cursor-pointer overflow-hidden"
                >
                  <div className={cn("absolute -top-4 -right-4 w-12 h-12 rounded-full blur-2xl opacity-20 bg-current transition-opacity group-hover:opacity-50", badge.color)} />
                  
                  <div className="flex items-start justify-between mb-4">
                     <div className={cn("p-3 rounded-xl bg-background/50 border border-white/5", badge.color)}>
                        <badge.icon className="w-6 h-6" />
                     </div>
                     {badge.status === "Verified" && (
                       <CircleCheck className="w-5 h-5 text-emerald-400" />
                     )}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn("text-[10px] uppercase font-bold tracking-widest", badge.status === "Verified" ? "text-emerald-400" : "text-muted-foreground")}>
                      {badge.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{badge.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReputation;
