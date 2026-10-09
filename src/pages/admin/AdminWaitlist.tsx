import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { Mail, Trophy, Building2, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface WaitlistEntry {
  id: string;
  email: string;
  role: "tech" | "creator" | "founder" | "builder";
  source: string;
  joinedAt: { toDate: () => Date } | string | null;
}

const formatDate = (ts: WaitlistEntry["joinedAt"]) => {
  if (!ts) return "—";
  if (typeof ts === "string") return new Date(ts).toLocaleDateString();
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function AdminWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "waitlist"), orderBy("joinedAt", "desc"))
      );
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })) as WaitlistEntry[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const techCount = entries.filter(e => e.role === "tech" || e.role === "builder").length;
  const creatorCount = entries.filter(e => e.role === "creator").length;
  const founderCount = entries.filter(e => e.role === "founder").length;

  const exportCSV = () => {
    const rows = [
      ["Email", "Role", "Source", "Joined"],
      ...entries.map(e => [e.email, e.role, e.source, formatDate(e.joinedAt)]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `soho-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Waitlist exported!", description: `${entries.length} entries downloaded.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-1">Waitlist Signups</h1>
          <p className="text-muted-foreground text-sm">
            {entries.length} total signups · {techCount} Tech · {creatorCount} Creators · {founderCount} Founders
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Signups", value: entries.length, icon: Users, color: "bg-primary/20 text-primary" },
          { label: "Tech Builders", value: techCount, icon: Trophy, color: "bg-orange-500/20 text-orange-400" },
          { label: "Growth Creators", value: creatorCount, icon: Users, color: "bg-purple-500/20 text-purple-400" },
          { label: "Founders", value: founderCount, icon: Building2, color: "bg-blue-500/20 text-blue-400" },
        ].map(s => (
          <div key={s.label} className="glass p-4 rounded-2xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass h-14 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-muted-foreground">
          <Mail size={32} className="mx-auto mb-3 opacity-40" />
          <p>No waitlist signups yet.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <span className="col-span-5">Email</span>
            <span className="col-span-2">Role</span>
            <span className="col-span-2">Source</span>
            <span className="col-span-3">Joined</span>
          </div>
          <div className="divide-y divide-border">
            {entries.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 px-5 py-3.5 items-center text-sm hover:bg-secondary/30 transition-colors"
              >
                <span className="col-span-5 font-medium truncate flex items-center gap-2">
                  <Mail size={13} className="text-muted-foreground flex-shrink-0" />
                  {e.email}
                </span>
                <span className="col-span-2">
                  <Badge
                    className={`text-[10px] border-0 ${
                      e.role === "creator"
                        ? "bg-purple-400/20 text-purple-300"
                        : e.role === "founder"
                        ? "bg-blue-400/20 text-blue-300"
                        : "bg-orange-400/20 text-orange-300"
                    }`}
                  >
                    {e.role === "creator" ? "🚀 Growth" : e.role === "founder" ? "🏢 Founder" : "🛠️ Tech"}
                  </Badge>
                </span>
                <span className="col-span-2 text-muted-foreground text-xs">{e.source}</span>
                <span className="col-span-3 text-muted-foreground text-xs">{formatDate(e.joinedAt)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
