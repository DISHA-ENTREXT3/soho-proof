import { motion } from "framer-motion";
import { Trophy, Swords, Star, Flame, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Total XP", value: "4,280", icon: Zap, change: "+320 this week", color: "text-primary" },
  { label: "Challenges Won", value: "12", icon: Trophy, change: "3 active", color: "text-yellow-400" },
  { label: "Reputation", value: "Elite", icon: Star, change: "Top 5%", color: "text-accent" },
  { label: "Streak", value: "14 days", icon: Flame, change: "Personal best!", color: "text-orange-400" },
];

const leaderboard = [
  { rank: 1, name: "Alex Rivera", xp: 8420, avatar: "AR", level: "Legend" },
  { rank: 2, name: "Mia Zhang", xp: 7150, avatar: "MZ", level: "Master" },
  { rank: 3, name: "Sam Okonkwo", xp: 6890, avatar: "SO", level: "Master" },
  { rank: 4, name: "You", xp: 4280, avatar: "JD", level: "Elite", isUser: true },
  { rank: 5, name: "Priya Patel", xp: 4100, avatar: "PP", level: "Elite" },
  { rank: 6, name: "Luca Moretti", xp: 3920, avatar: "LM", level: "Pro" },
];

const recentChallenges = [
  { title: "Build a Landing Page", status: "Won", xp: "+450", category: "Tech" },
  { title: "Growth Hack Campaign", status: "2nd Place", xp: "+280", category: "Growth" },
  { title: "API Design Challenge", status: "In Progress", xp: "—", category: "Tech" },
  { title: "Brand Identity Sprint", status: "Submitted", xp: "Pending", category: "Hybrid" },
];

const skills = [
  { name: "Frontend", level: 85, xp: 2100 },
  { name: "Growth", level: 62, xp: 1200 },
  { name: "Backend", level: 45, xp: 680 },
  { name: "Design", level: 30, xp: 300 },
];

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-muted-foreground",
  3: "text-orange-400",
};

const statusColors: Record<string, string> = {
  "Won": "bg-primary/20 text-primary",
  "2nd Place": "bg-yellow-400/20 text-yellow-400",
  "In Progress": "bg-blue-400/20 text-blue-400",
  "Submitted": "bg-accent/20 text-accent",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardOverview = () => {
  const currentXP = 4280;
  const nextLevelXP = 5000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">John</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your performance snapshot.</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
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

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading font-semibold text-foreground">Level Progress</h3>
            <p className="text-xs text-muted-foreground">Elite → Legend</p>
          </div>
          <span className="text-sm font-medium text-primary">{currentXP} / {nextLevelXP} XP</span>
        </div>
        <Progress value={xpProgress} className="h-3 bg-secondary" />
        <p className="text-xs text-muted-foreground mt-2">{nextLevelXP - currentXP} XP to next level</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-5 lg:col-span-3"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-yellow-400" />
            <h3 className="font-heading font-semibold text-foreground">Leaderboard</h3>
          </div>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  entry.isUser ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/30"
                }`}
              >
                <span className={`text-sm font-bold w-6 text-center ${rankColors[entry.rank] || "text-muted-foreground"}`}>
                  #{entry.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-foreground">{entry.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {entry.name} {entry.isUser && <span className="text-primary">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.level}</p>
                </div>
                <span className="text-sm font-heading font-semibold text-foreground">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-5 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Skill Graph</h3>
          </div>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.xp} XP</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(160, 84%, 39%), hsl(190, 80%, 45%))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Swords size={16} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Recent Challenges</h3>
        </div>
        <div className="space-y-2">
          {recentChallenges.map((challenge) => (
            <div
              key={challenge.title}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{challenge.title}</p>
                <p className="text-xs text-muted-foreground">{challenge.category}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[challenge.status]}`}>
                {challenge.status}
              </span>
              <span className="text-sm font-medium text-foreground w-16 text-right">{challenge.xp}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
