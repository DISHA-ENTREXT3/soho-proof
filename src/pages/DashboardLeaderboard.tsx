import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  Medal, 
  Search, 
  Filter, 
  Crown,
  ChevronDown,
  ArrowUpRight,
  Target
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const performanceData = [
  { day: "Mon", xp: 3200 },
  { day: "Tue", xp: 3400 },
  { day: "Wed", xp: 3300 },
  { day: "Thu", xp: 3800 },
  { day: "Fri", xp: 4100 },
  { day: "Sat", xp: 4280 },
  { day: "Sun", xp: 4280 },
];

const topPerformers = [
  { rank: 1, name: "Alex Rivera", xp: 8420, level: "Legend", avatar: "AR", trend: "+12%", color: "text-yellow-400" },
  { rank: 2, name: "Mia Zhang", xp: 7150, level: "Master", avatar: "MZ", trend: "+8%", color: "text-slate-300" },
  { rank: 3, name: "Sam Okonkwo", xp: 6890, level: "Master", avatar: "SO", trend: "+15%", color: "text-orange-400" },
];

const leaderboardData = [
  { rank: 4, name: "You", xp: 4280, level: "Elite", avatar: "JD", isUser: true, trend: "+5%" },
  { rank: 5, name: "Priya Patel", xp: 4100, level: "Elite", avatar: "PP", trend: "+2%" },
  { rank: 6, name: "Luca Moretti", xp: 3920, level: "Pro", avatar: "LM", trend: "-1%" },
  { rank: 7, name: "Sarah Chen", xp: 3850, level: "Pro", avatar: "SC", trend: "+10%" },
  { rank: 8, name: "Omar Hassan", xp: 3600, level: "Pro", avatar: "OH", trend: "+4%" },
];

import { useGlobalLeaderboard } from "@/hooks/use-challenges";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function getLevel(xp: number) {
  if (xp >= 15000) return "Legend";
  if (xp >= 10000) return "Master";
  if (xp >= 6000) return "Elite";
  if (xp >= 3000) return "Pro";
  if (xp >= 1000) return "Builder";
  return "Rookie";
}

const DashboardLeaderboard = () => {
  const { data: rawUsers, isLoading } = useGlobalLeaderboard();

  // Process data for podium and list
  const users = rawUsers?.map((u, i) => ({
    rank: i + 1,
    name: u.name || "Anonymous",
    xp: u.xp || 0,
    level: getLevel(u.xp || 0),
    avatar: u.name?.charAt(0) || "U",
    isUser: false, // Could be enhanced with useAuth check
    trend: "+0%",
  })) || [];

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-primary animate-pulse font-heading text-xl">Loading Global Rankings...</div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20 flex w-fit items-center gap-1.5 py-1">
            <Target className="w-3 h-3" /> Season 1: Genesis
          </Badge>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Global <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Competing with 2,481 builders worldwide. Top 10% this season will earn the <strong>Genesis Origin</strong> badge.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass h-11">
            <Filter className="w-4 h-4 mr-2" /> All Categories
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-11 px-6"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({ title: "Link copied!", description: "Leaderboard ranking link has been copied to clipboard." });
            }}
          >
            Share Ranking
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Top 3 & Chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((player) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: player.rank * 0.1 }}
                className={cn(
                  "glass p-6 relative overflow-hidden group",
                  player.rank === 1 && "border-yellow-400/30 bg-yellow-400/[0.02]"
                )}
              >
                {player.rank === 1 && (
                  <Crown className="absolute -top-1 -right-1 w-12 h-12 text-yellow-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
                      <AvatarFallback className="bg-secondary text-xl font-bold">{player.avatar}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-background",
                      player.rank === 1 ? "bg-yellow-400 text-yellow-950" : 
                      player.rank === 2 ? "bg-slate-300 text-slate-800" : "bg-orange-400 text-orange-950"
                    )}>
                      {player.rank}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg">{player.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{player.level}</p>
                  <div className="text-2xl font-heading font-bold gradient-text">{player.xp.toLocaleString()} XP</div>
                  <Badge variant="outline" className="mt-2 text-emerald-400 bg-emerald-400/10 border-0">
                    {player.trend} this week
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* XP Growth Chart */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold">Your XP Progression</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Current Path</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 500', 'dataMax + 500']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 15, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)'
                    }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorXp)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Extended Rankings */}
        <div className="lg:col-span-1">
          <div className="glass flex flex-col h-full">
            <div className="p-6 border-b border-white/5">
              <h3 className="font-heading font-bold flex items-center gap-2">
                <Medal className="w-5 h-5 text-accent" /> Extended Rankings
              </h3>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search builders..." className="pl-9 bg-secondary/50 border-white/5 h-9 text-sm" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {others.map((player) => (
                <motion.div
                  key={player.rank}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                    player.isUser ? "bg-primary/10 border border-primary/20" : "hover:bg-white/5"
                  )}
                >
                  <span className="text-sm font-bold w-6 text-muted-foreground">#{player.rank}</span>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-[10px] bg-secondary">{player.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {player.name} {player.isUser && <span className="text-[10px] text-primary uppercase ml-1">You</span>}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">{player.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{player.xp.toLocaleString()}</p>
                    <p className={cn("text-[10px]", player.trend.startsWith('+') ? "text-emerald-400" : "text-rose-400")}>
                      {player.trend}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              <div className="pt-4 flex justify-center">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  View Full Rankings <ChevronDown className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-primary/5 rounded-b-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Rank</span>
                <span className="font-bold flex items-center">
                  #4 <ArrowUpRight className="w-3 h-3 ml-1 text-emerald-400" />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Next Milestone</span>
                <span className="text-primary font-bold">Top 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLeaderboard;
