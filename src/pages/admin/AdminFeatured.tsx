import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Star, Award, Crown, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "talent" | "founder";
  xp?: number;
  wins?: number;
  companyName?: string;
  featured?: boolean;
  badge?: string;
  weeklySpotlight?: boolean;
}

const BUILDER_BADGES = ["🏆 Soho Champion", "⚡ Rising Star", "🔥 Top Performer", "🎯 Precision Coder", "🚀 Speed Builder", "💡 Innovator"];
const FOUNDER_BADGES = ["🏢 Top Employer", "🚀 Active Hirer", "⭐ Community Pick", "💼 Serial Founder", "🌟 MVP Founder"];

export default function AdminFeatured() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as User[];
      data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUser = async (id: string, update: Partial<User>) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "users", id), update as Record<string, unknown>);
      toast({ title: "Updated!" });
      await fetchUsers();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const builders = users.filter(u => u.role === "talent");
  const founders = users.filter(u => u.role === "founder");
  const weeklySpotlight = users.find(u => u.weeklySpotlight);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Feature & Badge Manager</h1>
        <p className="text-muted-foreground text-sm">Assign badges, feature members, and set the weekly spotlight builder.</p>
      </div>

      {/* Weekly Spotlight */}
      <section className="glass p-6 rounded-2xl space-y-4 border border-yellow-400/20">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-yellow-400" />
          <h2 className="font-heading font-semibold text-lg">Weekly Spotlight Builder</h2>
        </div>
        {weeklySpotlight ? (
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={weeklySpotlight.avatarUrl} />
              <AvatarFallback>{weeklySpotlight.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{weeklySpotlight.name}</p>
              <p className="text-sm text-muted-foreground">{weeklySpotlight.xp?.toLocaleString()} XP · {weeklySpotlight.wins || 0} wins</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => updateUser(weeklySpotlight.id, { weeklySpotlight: false })}>
              Remove Spotlight
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No builder is spotlighted this week. Select one below.</p>
        )}
      </section>

      {/* Builder Badge Manager */}
      <section className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-orange-400" />
          <h2 className="font-heading font-semibold text-lg">Builder Badges ({builders.length} builders)</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => <div key={i} className="glass h-16 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {builders.slice(0, 15).map(b => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-secondary/30"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={b.avatarUrl} />
                  <AvatarFallback className="text-xs">{b.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary font-bold">{(b.xp || 0).toLocaleString()} XP</span>
                    {b.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">{b.badge}</span>}
                    {b.weeklySpotlight && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">👑 Spotlight</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {BUILDER_BADGES.map(badge => (
                    <button
                      key={badge}
                      disabled={updatingId === b.id}
                      onClick={() => updateUser(b.id, { badge: b.badge === badge ? "" : badge })}
                      className={`text-[10px] px-2 py-1 rounded-full border transition-all ${b.badge === badge ? "bg-primary/30 border-primary/50 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                    >
                      {badge}
                    </button>
                  ))}
                  <button
                    disabled={updatingId === b.id}
                    onClick={() => updateUser(b.id, { weeklySpotlight: !b.weeklySpotlight, featured: true })}
                    className={`text-[10px] px-2 py-1 rounded-full border transition-all ${b.weeklySpotlight ? "bg-yellow-500/30 border-yellow-500/50 text-yellow-400" : "border-border text-muted-foreground hover:border-yellow-500/30"}`}
                  >
                    👑 Spotlight
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Founder Badge Manager */}
      <section className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-blue-400" />
          <h2 className="font-heading font-semibold text-lg">Founder Badges ({founders.length} founders)</h2>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => <div key={i} className="glass h-16 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {founders.slice(0, 10).map(f => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-secondary/30"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={f.avatarUrl} />
                  <AvatarFallback className="text-xs">{f.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{f.companyName || f.email}</span>
                    {f.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{f.badge}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {FOUNDER_BADGES.map(badge => (
                    <button
                      key={badge}
                      disabled={updatingId === f.id}
                      onClick={() => updateUser(f.id, { badge: f.badge === badge ? "" : badge })}
                      className={`text-[10px] px-2 py-1 rounded-full border transition-all ${f.badge === badge ? "bg-blue-500/30 border-blue-500/50 text-blue-400" : "border-border text-muted-foreground hover:border-blue-500/30"}`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
