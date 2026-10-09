import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Crown, Zap, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Builder {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  xp: number;
  level?: number;
  wins?: number;
  submissionCount?: number;
  subscriptionTier?: string;
  featured?: boolean;
  badge?: string;
}

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Crown size={18} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={18} className="text-slate-300" />;
  if (rank === 3) return <Medal size={18} className="text-orange-400" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>;
};

const levelLabel = (xp: number) => {
  const lvl = Math.floor(Math.sqrt(xp / 100)) + 1;
  if (lvl >= 10) return "Legend";
  if (lvl >= 8) return "Master";
  if (lvl >= 6) return "Elite";
  if (lvl >= 4) return "Pro";
  return "Starter";
};

export default function AdminBuilders() {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBuilders = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "users"), where("role", "==", "talent")));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Builder[];
      data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setBuilders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBuilders(); }, []);

  const toggleFeatured = async (builder: Builder) => {
    setUpdatingId(builder.id);
    try {
      await updateDoc(doc(db, "users", builder.id), { featured: !builder.featured });
      toast({ title: builder.featured ? "Removed from featured" : "Builder featured!", description: builder.name });
      await fetchBuilders();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const setBadge = async (id: string, badge: string) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "users", id), { badge });
      toast({ title: "Badge assigned!", description: badge });
      await fetchBuilders();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderBuilderRow = (builder: Builder, rank: number) => (
    <motion.div
      key={builder.id}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.03 }}
      className={`glass p-4 rounded-xl flex flex-wrap items-center gap-4 ${builder.featured ? "border-primary/40" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <RankIcon rank={rank} />
        <Avatar className="w-9 h-9">
          <AvatarImage src={builder.avatarUrl} />
          <AvatarFallback className="text-xs">{builder.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{builder.name}</p>
            {builder.featured && <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
            {builder.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{builder.badge}</span>
            )}
            {builder.subscriptionTier === "pro" && (
              <Badge className="bg-primary/20 text-primary border-0 text-[10px] py-0">Pro</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{builder.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="text-center">
          <p className="font-bold text-primary">{(builder.xp || 0).toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">XP</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{levelLabel(builder.xp || 0)}</p>
          <p className="text-[10px] text-muted-foreground">Level</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{builder.wins || 0}</p>
          <p className="text-[10px] text-muted-foreground">Wins</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{builder.submissionCount || 0}</p>
          <p className="text-[10px] text-muted-foreground">Subs</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant={builder.featured ? "default" : "outline"}
          className="h-8 text-xs"
          disabled={updatingId === builder.id}
          onClick={() => toggleFeatured(builder)}
        >
          <Star size={12} className="mr-1" />
          {builder.featured ? "Unfeature" : "Feature"}
        </Button>
        {["🏆 Winner", "⚡ Rising Star", "🔥 Top Performer"].map(b => (
          <Button
            key={b}
            size="sm"
            variant={builder.badge === b ? "default" : "secondary"}
            className="h-8 text-xs"
            disabled={updatingId === builder.id}
            onClick={() => setBadge(builder.id, builder.badge === b ? "" : b)}
          >
            {b}
          </Button>
        ))}
        <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
          <Link to={`/profile/${builder.id}`} target="_blank">Profile</Link>
        </Button>
      </div>
    </motion.div>
  );

  const sohoWinners = builders.filter(b => (b.wins || 0) > 0).slice(0, 20);
  const topByXP = [...builders].slice(0, 20);
  const topSubmitters = [...builders].sort((a, b) => (b.submissionCount || 0) - (a.submissionCount || 0)).slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Builder Rankings</h1>
        <p className="text-muted-foreground text-sm">{builders.length} total builders · Feature top performers to boost their visibility</p>
      </div>

      <Tabs defaultValue="xp">
        <TabsList>
          <TabsTrigger value="xp">🏆 Top by XP</TabsTrigger>
          <TabsTrigger value="wins">🥇 Most Wins</TabsTrigger>
          <TabsTrigger value="subs">⚡ Most Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="xp" className="space-y-3 mt-4">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
            : topByXP.map((b, i) => renderBuilderRow(b, i + 1))}
        </TabsContent>

        <TabsContent value="wins" className="space-y-3 mt-4">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
            : sohoWinners.map((b, i) => renderBuilderRow(b, i + 1))}
        </TabsContent>

        <TabsContent value="subs" className="space-y-3 mt-4">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
            : topSubmitters.map((b, i) => renderBuilderRow(b, i + 1))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
