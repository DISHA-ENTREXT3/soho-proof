import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Zap, Users, Building2, Trophy, TrendingUp, Flag } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  totalChallenges: number;
  openChallenges: number;
  totalBuilders: number;
  totalFounders: number;
  totalSubmissions: number;
  proUsers: number;
}

const StatCard = ({
  label, value, icon: Icon, color
}: {
  label: string; value: number | string; icon: React.ElementType; color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-2xl flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-heading font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalChallenges: 0, openChallenges: 0,
    totalBuilders: 0, totalFounders: 0,
    totalSubmissions: 0, proUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [challenges, submissions, users] = await Promise.all([
          getDocs(collection(db, "challenges")),
          getDocs(collection(db, "submissions")),
          getDocs(collection(db, "users")),
        ]);
        const usersData = users.docs.map(d => d.data());
        setStats({
          totalChallenges: challenges.size,
          openChallenges: challenges.docs.filter(d => d.data().status === "Open").length,
          totalSubmissions: submissions.size,
          totalBuilders: usersData.filter(u => u.role === "talent").length,
          totalFounders: usersData.filter(u => u.role === "founder").length,
          proUsers: usersData.filter(u => u.subscriptionTier === "pro").length,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Challenges", value: stats.totalChallenges, icon: Zap, color: "bg-primary/20 text-primary" },
    { label: "Open Challenges", value: stats.openChallenges, icon: Flag, color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Builders", value: stats.totalBuilders, icon: Trophy, color: "bg-orange-500/20 text-orange-400" },
    { label: "Founders", value: stats.totalFounders, icon: Building2, color: "bg-blue-500/20 text-blue-400" },
    { label: "Submissions", value: stats.totalSubmissions, icon: TrendingUp, color: "bg-purple-500/20 text-purple-400" },
    { label: "Pro Members", value: stats.proUsers, icon: Users, color: "bg-yellow-500/20 text-yellow-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Admin Overview</h1>
        <p className="text-muted-foreground text-sm">Platform health at a glance for the Soho Space team.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass p-6 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div className="glass p-6 rounded-2xl space-y-3">
        <h2 className="font-heading font-semibold text-lg">🛠️ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Post Platform Challenge", href: "/admin/challenges" },
            { label: "Feature a Builder", href: "/admin/featured" },
            { label: "View Builder Rankings", href: "/admin/builders" },
            { label: "Community Showcase", href: "/admin/community" },
          ].map(a => (
            <a key={a.label} href={a.href} className="p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-sm font-medium transition-all text-center">
              {a.label}
            </a>
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl space-y-3">
        <h2 className="font-heading font-semibold text-lg">💡 Suggested Next Steps</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>📌 Post this week's platform challenge (Sunday Drop) from <strong>Challenge Manager</strong></li>
          <li>🏆 Review new submissions and crown winners from <strong>Builder Rankings</strong></li>
          <li>🌟 Feature top builders and founders in the <strong>Community Showcase</strong></li>
          <li>📧 Send the weekly builder digest from <strong>Reports</strong> tab</li>
        </ul>
      </div>
    </div>
  );
}
