"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  Users, 
  Zap, 
  Trophy, 
  Swords, 
  TrendingUp, 
  ArrowUpRight,
  MessageSquare,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active Challenges", value: "3", icon: Swords, color: "text-primary", gradient: "from-primary/10 to-primary/5" },
  { label: "Submissions Received", value: "24", icon: MessageSquare, color: "text-blue-400", gradient: "from-blue-400/10 to-blue-400/5" },
  { label: "Engaged Builders", value: "82", icon: Users, color: "text-accent", gradient: "from-accent/10 to-accent/5" },
  { label: "Total Prize Pool", value: "$4,500", icon: Trophy, color: "text-yellow-400", gradient: "from-yellow-400/10 to-yellow-400/5" },
];

const activeChallenges = [
  { id: "1", title: "Real-Time Dashboard UI", submissions: 12, deadline: "2d left", status: "Active", category: "Tech" },
  { id: "2", title: "Growth Strategy Sprint", submissions: 8, deadline: "5d left", status: "Active", category: "Growth" },
  { id: "3", title: "API Performance Tuning", submissions: 4, deadline: "Ended", status: "Judging", category: "Tech" },
];

const topBuilders = [
  { name: "Alex Rivera", xp: 8420, avatar: "AR", rank: 1, wins: 5 },
  { name: "Mia Zhang", xp: 7150, avatar: "MZ", rank: 2, wins: 3 },
  { name: "Sam Okonkwo", xp: 6890, avatar: "SO", rank: 3, wins: 2 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FounderOverview = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Founder <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your challenges and discover top talent.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/profile/jane-cooper">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary h-11 px-6">
              View Public Profile
            </Button>
          </Link>
          <Link to="/dashboard/challenges/create">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-11 px-6">
              <Plus size={18} className="mr-2" />
              Post New Challenge
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
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
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Engineering Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 space-y-4 border-l-4 border-l-blue-500"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Swords size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Engineering Pipeline</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Technical Hiring</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
             {activeChallenges.filter(c => c.category === "Tech").map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 hover:bg-secondary/30 transition-all group border border-transparent hover:border-blue-500/20 shadow-sm"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">{challenge.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Users size={12} className="text-blue-400" /> {challenge.submissions} Submissions</span>
                    <span className="flex items-center gap-1 text-red-400/80"><Clock size={12} /> {challenge.deadline}</span>
                  </div>
                </div>
                <Badge className="bg-blue-500/10 text-blue-500 border-0 text-[10px] font-bold">
                  {challenge.status}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Growth Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 space-y-4 border-l-4 border-l-orange-500"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Growth Pipeline</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Marketing & Sales</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
             {activeChallenges.filter(c => c.category === "Growth").map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 hover:bg-secondary/30 transition-all group border border-transparent hover:border-orange-500/20 shadow-sm"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-orange-500 transition-colors">{challenge.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Users size={12} className="text-orange-400" /> {challenge.submissions} Submissions</span>
                    <span className="flex items-center gap-1 text-red-400/80"><Clock size={12} /> {challenge.deadline}</span>
                  </div>
                </div>
                <Badge className="bg-orange-500/10 text-orange-500 border-0 text-[10px] font-bold">
                  {challenge.status}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-1 gap-6 mt-8">
        {/* Top Builders / Discovery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Trophy size={20} />
              </div>
              <h3 className="font-heading font-bold text-xl text-foreground tracking-tight">Top Alpha Builders in your Pipeline</h3>
            </div>
            <Link to="/dashboard/founders">
              <Button variant="ghost" className="text-primary hover:text-primary/80 font-bold flex items-center gap-2">
                Discover More Talent <ArrowUpRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {topBuilders.map((builder) => (
              <div key={builder.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-primary font-bold border border-border shadow-sm">
                    {builder.avatar}
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{builder.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Rank #{builder.rank}</span>
                      <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{builder.wins} Wins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                     <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Identity Score</p>
                     <p className="text-lg font-heading font-bold text-primary">98/100</p>
                   </div>
                   <Zap size={20} className="text-primary animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FounderOverview;
