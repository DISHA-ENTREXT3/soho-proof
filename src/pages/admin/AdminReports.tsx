import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { FileText, Users, Zap, Building2, Trophy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Stats {
  totalBuilders: number;
  totalFounders: number;
  totalChallenges: number;
  totalSubmissions: number;
  openChallenges: number;
  proUsers: number;
  totalWins: number;
  totalXP: number;
}

export default function AdminReports() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [challenges, submissions, users] = await Promise.all([
          getDocs(collection(db, "challenges")),
          getDocs(collection(db, "submissions")),
          getDocs(collection(db, "users")),
        ]);
        const usersData = users.docs.map(d => d.data());
        const builders = usersData.filter(u => u.role === "talent");
        setStats({
          totalBuilders: builders.length,
          totalFounders: usersData.filter(u => u.role === "founder").length,
          totalChallenges: challenges.size,
          totalSubmissions: submissions.size,
          openChallenges: challenges.docs.filter(d => d.data().status === "Open").length,
          proUsers: usersData.filter(u => u.subscriptionTier === "pro").length,
          totalWins: builders.reduce((acc, u) => acc + (u.wins || 0), 0),
          totalXP: builders.reduce((acc, u) => acc + (u.xp || 0), 0),
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const exportCSV = async (type: string) => {
    try {
      let rows: string[][] = [];
      if (type === "builders") {
        const snap = await getDocs(collection(db, "users"));
        const builders = snap.docs.filter(d => d.data().role === "talent").map(d => d.data());
        rows = [
          ["Name", "Email", "XP", "Wins", "Submissions", "Plan"],
          ...builders.map(b => [b.name, b.email, String(b.xp || 0), String(b.wins || 0), String(b.submissionCount || 0), b.subscriptionTier || "starter"]),
        ];
      } else if (type === "founders") {
        const snap = await getDocs(collection(db, "users"));
        const founders = snap.docs.filter(d => d.data().role === "founder").map(d => d.data());
        rows = [
          ["Name", "Email", "Company", "Challenges", "Plan"],
          ...founders.map(f => [f.name, f.email, f.companyName || "", String(f.challengeCount || 0), f.subscriptionTier || "starter"]),
        ];
      } else if (type === "challenges") {
        const snap = await getDocs(collection(db, "challenges"));
        rows = [
          ["Title", "Status", "Category", "Difficulty", "Participants", "Founder", "RewardType", "Reward"],
          ...snap.docs.map(d => {
            const c = d.data();
            return [c.title, c.status, c.category, c.difficulty, String(c.currentParticipants), c.founderName, c.rewardType, c.rewardLabel];
          }),
        ];
      }

      const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soho-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export complete!", description: `${type}.csv downloaded.` });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const metrics = stats ? [
    { label: "Total Builders", value: stats.totalBuilders, icon: Trophy, color: "text-orange-400" },
    { label: "Total Founders", value: stats.totalFounders, icon: Building2, color: "text-blue-400" },
    { label: "Active Challenges", value: stats.openChallenges, icon: Zap, color: "text-primary" },
    { label: "Total Submissions", value: stats.totalSubmissions, icon: Users, color: "text-purple-400" },
    { label: "Pro Members", value: stats.proUsers, icon: Users, color: "text-yellow-400" },
    { label: "Total XP Earned", value: stats.totalXP.toLocaleString(), icon: Zap, color: "text-emerald-400" },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-1">Reports & Exports</h1>
        <p className="text-muted-foreground text-sm">Platform metrics snapshot and data exports for analysis.</p>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="glass h-24 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map(m => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-5 rounded-xl"
            >
              <m.icon size={18} className={`${m.color} mb-2`} />
              <p className="text-2xl font-heading font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* CSV Exports */}
      <div className="glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h2 className="font-heading font-semibold text-lg">Data Exports</h2>
        </div>
        <p className="text-sm text-muted-foreground">Download CSV exports for external analysis, ATS integration, or weekly digest preparation.</p>
        <div className="flex flex-wrap gap-3">
          {[
            { type: "builders", label: "Export All Builders" },
            { type: "founders", label: "Export All Founders" },
            { type: "challenges", label: "Export All Challenges" },
          ].map(e => (
            <Button key={e.type} variant="outline" className="flex items-center gap-2" onClick={() => exportCSV(e.type)}>
              <Download size={14} />
              {e.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="glass p-6 rounded-2xl space-y-3">
        <h2 className="font-heading font-semibold text-lg">🚀 Suggested Admin Improvements</h2>
        <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
          <li><strong>Weekly Challenge Drop</strong>: Schedule Sunday challenge drops via Firestore scheduled functions or manual publishing.</li>
          <li><strong>Email Digest</strong>: Export subscribers + send weekly challenge email via Resend or Substack API from this panel.</li>
          <li><strong>Auto-Grade Bot</strong>: Connect GitHub API to auto-run CI checks on submission PR links and pre-score them.</li>
          <li><strong>Leaderboard Seasons</strong>: Monthly XP reset with archived "Season Champions" badges.</li>
          <li><strong>Founder Matchmaking</strong>: Auto-suggest top 3 builders to founders based on challenge category and XP level.</li>
          <li><strong>Builder Spotlights</strong>: Auto-generate weekly "Builder of the Week" shareable card for social media.</li>
          <li><strong>Abuse Detection</strong>: Flag duplicate submission links or spam entries automatically.</li>
          <li><strong>Waitlist Manager</strong>: Manage newsletter subscriber list and track open/click rates.</li>
        </ul>
      </div>
    </div>
  );
}
