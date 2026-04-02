import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Clock, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { mockChallenges } from "@/data/mockChallenges";
import {
  CATEGORIES,
  STATUSES,
  DIFFICULTIES,
  type ChallengeCategory,
  type ChallengeStatus,
  type ChallengeDifficulty,
} from "@/types/challenge";

const categoryColors: Record<ChallengeCategory, string> = {
  Tech: "bg-blue-500/20 text-blue-400",
  Growth: "bg-emerald-500/20 text-emerald-400",
  Hybrid: "bg-amber-500/20 text-amber-400",
  Design: "bg-pink-500/20 text-pink-400",
  Data: "bg-violet-500/20 text-violet-400",
};

const statusColors: Record<ChallengeStatus, string> = {
  Open: "bg-primary/20 text-primary",
  "In Progress": "bg-blue-400/20 text-blue-400",
  Judging: "bg-amber-400/20 text-amber-400",
  Completed: "bg-muted text-muted-foreground",
};

const difficultyColors: Record<ChallengeDifficulty, string> = {
  Beginner: "text-emerald-400",
  Intermediate: "text-blue-400",
  Advanced: "text-amber-400",
  Expert: "text-red-400",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardChallenges = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | "All">("All");

  const filtered = useMemo(() => {
    return mockChallenges.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
      if (selectedStatus !== "All" && c.status !== selectedStatus) return false;
      if (selectedDifficulty !== "All" && c.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [search, selectedCategory, selectedStatus, selectedDifficulty]);

  const daysLeft = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff}d left` : "Ended";
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Challenges</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse, filter, and compete.</p>
        </div>
        <Link to="/dashboard/challenges/create">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={16} className="mr-2" />
            Create Challenge
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="glass p-4 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter size={10} /> Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as ChallengeCategory | "All")}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s as ChallengeStatus | "All")}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedStatus === s
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Difficulty</label>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...DIFFICULTIES].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d as ChallengeDifficulty | "All")}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    selectedDifficulty === d
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{filtered.length} challenge{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Challenge Cards */}
      {filtered.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-muted-foreground">No challenges match your filters.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((challenge) => (
            <motion.div key={challenge.id} variants={item}>
              <Link to={`/dashboard/challenges/${challenge.id}`} className="block">
                <div className="glass p-5 h-full flex flex-col hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${categoryColors[challenge.category]} border-0 text-xs`}>
                      {challenge.category}
                    </Badge>
                    <Badge className={`${statusColors[challenge.status]} border-0 text-xs`}>
                      {challenge.status}
                    </Badge>
                    <span className={`text-xs ml-auto ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {challenge.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {daysLeft(challenge.deadline)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {challenge.currentParticipants}/{challenge.maxParticipants}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Zap size={12} /> {challenge.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-[10px] font-medium text-foreground">{challenge.founderAvatar}</span>
                      </div>
                      <div>
                        <p className="text-xs text-foreground">{challenge.founderName}</p>
                        <p className="text-[10px] text-muted-foreground">{challenge.companyName}</p>
                      </div>
                    </div>
                    <span className="text-sm font-heading font-semibold text-primary">{challenge.prize}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DashboardChallenges;
