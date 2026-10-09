import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Star, Users, Building2, Trophy, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "talent" | "founder";
  xp?: number;
  wins?: number;
  companyName?: string;
  subscriptionTier?: string;
  featured?: boolean;
  badge?: string;
}

export default function AdminCommunity() {
  const [featuredBuilders, setFeaturedBuilders] = useState<User[]>([]);
  const [featuredFounders, setFeaturedFounders] = useState<User[]>([]);
  const [allBuilders, setAllBuilders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[];
      setFeaturedBuilders(all.filter(u => u.role === "talent" && u.featured));
      setFeaturedFounders(all.filter(u => u.role === "founder" && u.featured));
      const builders = all.filter(u => u.role === "talent");
      builders.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setAllBuilders(builders.slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleFeatured = async (user: User) => {
    setUpdatingId(user.id);
    try {
      await updateDoc(doc(db, "users", user.id), { featured: !user.featured });
      toast({ title: user.featured ? "Removed from showcase" : "Added to showcase!" });
      await fetchData();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const UserCard = ({ user }: { user: User }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-4 rounded-xl flex flex-col items-center text-center gap-3"
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center justify-center gap-1">
          <p className="font-semibold text-sm">{user.name}</p>
          {user.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
        </div>
        {user.badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{user.badge}</span>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{user.companyName || user.email}</p>
        {user.xp !== undefined && (
          <p className="text-xs font-bold text-primary mt-0.5">{user.xp.toLocaleString()} XP · {user.wins || 0} wins</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={user.featured ? "default" : "outline"}
          className="h-7 text-xs"
          disabled={updatingId === user.id}
          onClick={() => toggleFeatured(user)}
        >
          {user.featured ? "Remove" : "Showcase"}
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" asChild>
          <Link to={`/profile/${user.id}`} target="_blank">Profile</Link>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Community Showcase</h1>
        <p className="text-muted-foreground text-sm">Control who appears in the public community spotlight and builder showcase.</p>
      </div>

      {/* Featured Builders */}
      <section className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          <h2 className="font-heading font-semibold text-lg">Featured Builders ({featuredBuilders.length})</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="glass h-40 rounded-xl animate-pulse" />)}
          </div>
        ) : featuredBuilders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured builders yet. Go to Builder Rankings and click "Feature" to add some.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredBuilders.map(b => <UserCard key={b.id} user={b} />)}
          </div>
        )}
      </section>

      {/* Featured Founders */}
      <section className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-blue-400" />
          <h2 className="font-heading font-semibold text-lg">Featured Founders ({featuredFounders.length})</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="glass h-40 rounded-xl animate-pulse" />)}
          </div>
        ) : featuredFounders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No featured founders yet. Go to Founder Rankings and click "Feature" to add some.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredFounders.map(f => <UserCard key={f.id} user={f} />)}
          </div>
        )}
      </section>

      {/* Top 10 Builders Preview (Public Leaderboard) */}
      <section className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-yellow-400" />
          <h2 className="font-heading font-semibold text-lg">Top 10 Builders by XP (Live Leaderboard Preview)</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => <div key={i} className="glass h-14 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {allBuilders.map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{i + 1}</span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={b.avatarUrl} />
                  <AvatarFallback className="text-xs">{b.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="flex-1 text-sm font-medium truncate">{b.name}</p>
                {b.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">{b.badge}</span>}
                {b.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                <p className="text-sm font-bold text-primary">{(b.xp || 0).toLocaleString()} XP</p>
                <p className="text-xs text-muted-foreground">{b.wins || 0} wins</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
