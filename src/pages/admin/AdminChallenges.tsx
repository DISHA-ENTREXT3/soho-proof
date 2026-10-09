import { useEffect, useState, lazy, Suspense } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, Clock, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Lazy-load CreateChallenge page to reuse form logic
const CreateChallenge = lazy(() => import("@/pages/CreateChallenge"));

interface AdminChallenge {
  id: string;
  title: string;
  status: string;
  category: string;
  difficulty: string;
  currentParticipants: number;
  maxParticipants: number;
  rewardType: string;
  rewardLabel: string;
  founderId: string;
  founderName: string;
  createdAt: string;
  isSohoChallenge?: boolean;
}

const statusColor: Record<string, string> = {
  Open: "bg-emerald-500/20 text-emerald-400",
  "In Progress": "bg-blue-500/20 text-blue-400",
  Judging: "bg-yellow-500/20 text-yellow-400",
  Completed: "bg-muted text-muted-foreground",
};

export default function AdminChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "challenges"));
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as AdminChallenge[];
      // Sort: Soho Space challenges first, then by creation date
      data.sort((a, b) => {
        if (a.isSohoChallenge && !b.isSohoChallenge) return -1;
        if (!a.isSohoChallenge && b.isSohoChallenge) return 1;
        return 0;
      });
      setChallenges(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "challenges", id), { status });
      toast({ title: "Status updated", description: `Challenge marked as ${status}.` });
      await fetchChallenges();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  const sohoCount = challenges.filter(c => c.isSohoChallenge).length;
  const founderCount = challenges.filter(c => !c.isSohoChallenge).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-1">Challenge Manager</h1>
          <p className="text-muted-foreground text-sm">
            {sohoCount} Soho Space challenges · {founderCount} Founder challenges
          </p>
        </div>
        <Button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-2">
          <Plus size={16} />
          {showCreate ? "Cancel" : "Post Soho Challenge"}
        </Button>
      </div>

      {showCreate && (
        <div className="glass rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-lg mb-4">New Soho Space Platform Challenge</h2>
          <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading form...</div>}>
            <CreateChallenge />
          </Suspense>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="glass h-20 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {challenges.map(c => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-5 rounded-xl flex flex-wrap items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {c.isSohoChallenge && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Soho Challenge
                    </span>
                  )}
                  <Badge className={`${statusColor[c.status]} border-0 text-xs`}>{c.status}</Badge>
                  <Badge variant="outline" className="text-xs">{c.category}</Badge>
                  <Badge variant="outline" className="text-xs">{c.difficulty}</Badge>
                </div>
                <p className="font-semibold truncate">{c.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={12} />{c.currentParticipants}/{c.maxParticipants}</span>
                  <span className="flex items-center gap-1"><Zap size={12} />{c.rewardType}: {c.rewardLabel}</span>
                  <span>by {c.founderName}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex flex-wrap gap-2">
                {["Open", "Judging", "Completed"].map(s => (
                  <Button
                    key={s}
                    variant={c.status === s ? "default" : "secondary"}
                    size="sm"
                    disabled={updatingId === c.id}
                    onClick={() => handleStatusChange(c.id, s)}
                    className="h-8 text-xs"
                  >
                    {s === "Completed" ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                    {s}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                  <a href={`/dashboard/founder/challenges/${c.id}/manage`} target="_blank" rel="noopener noreferrer">
                    Manage
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
