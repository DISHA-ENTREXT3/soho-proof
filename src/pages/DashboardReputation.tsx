import React from "react";
import { motion } from "framer-motion";
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
  Download
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useGlobalLeaderboard } from "@/hooks/use-challenges";
import { toast } from "@/hooks/use-toast";

const skillData = [
  { subject: 'Frontend', A: 85, fullMark: 100 },
  { subject: 'Backend', A: 62, fullMark: 100 },
  { subject: 'Growth', A: 45, fullMark: 100 },
  { subject: 'Data', A: 30, fullMark: 100 },
  { subject: 'Strategy', A: 75, fullMark: 100 },
  { subject: 'Design', A: 55, fullMark: 100 },
];

const badges = [
  { name: "Early Adopter", icon: Globe, status: "Verified", color: "text-blue-400", date: "Jan 2026" },
  { name: "Speed Demon", icon: Zap, status: "Verified", color: "text-yellow-400", date: "Feb 2026" },
  { name: "Code Architect", icon: Cpu, status: "Verified", color: "text-accent", date: "Mar 2026" },
  { name: "Growth Hacker", icon: GitBranch, status: "Pending", color: "text-emerald-400", date: "—" },
];

const timeline = [
  { title: "Landing Page MVP", event: "Submission Won", date: "Mar 12, 2026", xp: "+800 XP", category: "Frontend", link: "/dashboard/challenges" },
  { title: "API Integration Sprint", event: "2nd Place", date: "Feb 28, 2026", xp: "+450 XP", category: "Backend", link: "/dashboard/challenges" },
  { title: "Onboarding Flow Optimization", event: "Top 5%", date: "Feb 15, 2026", xp: "+300 XP", category: "Growth", link: "/dashboard/challenges" },
];

const DashboardReputation = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { data: globalBoard } = useGlobalLeaderboard();

  const xp = profile?.role === 'talent' ? profile.xp : 0;
  const trustScore = Math.min(99, 50 + Math.floor(xp / 100));
  const wins = profile?.role === 'talent' ? profile.wins : 0;
  const rank = globalBoard?.findIndex(u => u.uid === user?.uid) ?? -1;
  const rankDisplay = rank >= 0 ? `#${rank + 1}` : "Unranked";
  const xp24h = `+${Math.floor(xp * 0.05)}`; // Mock 24h XP based on total

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
                Updated: 2h ago
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
                        onClick={() => window.open(item.link, '_blank')}
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
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:bg-white/5 py-2">
              See All History
            </Button>
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
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{badge.date}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto pt-10 text-center">
              <div className="inline-flex p-4 rounded-3xl bg-primary/5 border border-primary/10 flex-col items-center gap-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Coming Soon</p>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full bg-secondary border-4 border-background flex items-center justify-center">
                        <Award className="w-4 h-4 text-muted-foreground/50" />
                     </div>
                   ))}
                </div>
                <p className="text-xs text-foreground px-4">Complete <strong>Algorithm Challenge #2</strong> to unlock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReputation;
