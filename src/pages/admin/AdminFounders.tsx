import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Building2, Crown, Star, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Founder {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  companyName?: string;
  website?: string;
  challengeCount?: number;
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

export default function AdminFounders() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [challengeCounts, setChallengeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersSnap, challengesSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), where("role", "==", "founder"))),
        getDocs(collection(db, "challenges")),
      ]);

      const data = usersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Founder[];

      // Count challenges per founder
      const counts: Record<string, number> = {};
      challengesSnap.docs.forEach(d => {
        const fid = d.data().founderId as string;
        if (fid) counts[fid] = (counts[fid] || 0) + 1;
      });

      setChallengeCounts(counts);
      data.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
      setFounders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleFeatured = async (founder: Founder) => {
    setUpdatingId(founder.id);
    try {
      await updateDoc(doc(db, "users", founder.id), { featured: !founder.featured });
      toast({ title: founder.featured ? "Removed from featured" : "Founder featured!", description: founder.name });
      await fetchData();
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
      await fetchData();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const renderFounderRow = (founder: Founder, rank: number) => {
    const count = challengeCounts[founder.id] || 0;
    return (
      <motion.div
        key={founder.id}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.03 }}
        className={`glass p-4 rounded-xl flex flex-wrap items-center gap-4 ${founder.featured ? "border-primary/40" : ""}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <RankIcon rank={rank} />
          <Avatar className="w-9 h-9">
            <AvatarImage src={founder.avatarUrl} />
            <AvatarFallback className="text-xs">{founder.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{founder.name}</p>
              {founder.featured && <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
              {founder.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">{founder.badge}</span>
              )}
              {founder.subscriptionTier === "pro" && (
                <Badge className="bg-primary/20 text-primary border-0 text-[10px] py-0">Pro</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{founder.companyName || founder.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-blue-400">{count}</p>
            <p className="text-[10px] text-muted-foreground">Challenges</p>
          </div>
          <div className="text-center">
            <p className="font-bold">{founder.subscriptionTier === "pro" ? "Pro" : "Starter"}</p>
            <p className="text-[10px] text-muted-foreground">Plan</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={founder.featured ? "default" : "outline"}
            className="h-8 text-xs"
            disabled={updatingId === founder.id}
            onClick={() => toggleFeatured(founder)}
          >
            <Star size={12} className="mr-1" />
            {founder.featured ? "Unfeature" : "Feature"}
          </Button>
          {["🏢 Top Employer", "🚀 Active Hirer", "⭐ Community Pick"].map(b => (
            <Button
              key={b}
              size="sm"
              variant={founder.badge === b ? "default" : "secondary"}
              className="h-8 text-xs"
              disabled={updatingId === founder.id}
              onClick={() => setBadge(founder.id, founder.badge === b ? "" : b)}
            >
              {b}
            </Button>
          ))}
          <Button size="sm" variant="ghost" className="h-8 text-xs" asChild>
            <Link to={`/profile/${founder.id}`} target="_blank">Profile</Link>
          </Button>
        </div>
      </motion.div>
    );
  };

  const byActivity = [...founders].sort((a, b) => (challengeCounts[b.id] || 0) - (challengeCounts[a.id] || 0));
  const proOnly = founders.filter(f => f.subscriptionTier === "pro");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Founder Rankings</h1>
        <p className="text-muted-foreground text-sm">{founders.length} total founders · Rank and feature based on challenge activity</p>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">🏢 Most Active (Challenges Posted)</TabsTrigger>
          <TabsTrigger value="pro">👑 Pro Founders</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-3 mt-4">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
            : byActivity.map((f, i) => renderFounderRow(f, i + 1))}
        </TabsContent>

        <TabsContent value="pro" className="space-y-3 mt-4">
          {loading
            ? Array(5).fill(0).map((_, i) => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)
            : proOnly.map((f, i) => renderFounderRow(f, i + 1))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
