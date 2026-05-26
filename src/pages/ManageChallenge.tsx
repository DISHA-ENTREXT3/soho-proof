import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Trophy, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChallenge, useSubmissions } from "@/hooks/use-challenges";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { writeBatch, doc, increment, addDoc, collection, serverTimestamp, getDocs, query, where, updateDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Submission, Payout } from "@/types/challenge";

const FEEDBACK_OPTIONS = [
  "Amazing",
  "Out of the box",
  "Very Unique",
  "Best",
  "Better",
  "Good",
  "Can be Innovative",
  "Can Improve",
  "Not Unique",
  "Not original",
  "Copied",
  "Not Good",
  "Poor",
  "Very Poor",
  "Worst"
];

const ManageChallenge = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: challenge, isLoading: challengeLoading } = useChallenge(id);
  const { data: submissions, isLoading: subsLoading } = useSubmissions(id);
  
  const [scores, setScores] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payout, setPayout] = useState<Payout | null>(null);
  const [loadingPayout, setLoadingPayout] = useState(true);
  const [isUpdatingPayout, setIsUpdatingPayout] = useState(false);
  const [transferReference, setTransferReference] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");

  useEffect(() => {
    const fetchPayout = async () => {
      if (!id) {
        setLoadingPayout(false);
        return;
      }
      try {
        const payoutQuery = query(collection(db, "payouts"), where("challengeId", "==", id));
        const snapshot = await getDocs(payoutQuery);
        if (!snapshot.empty) {
          const payoutDoc = snapshot.docs[0];
          const payoutData = payoutDoc.data() as Record<string, unknown>;
          const normalizedPayout: Payout = {
            id: payoutDoc.id,
            challengeId: String(payoutData.challengeId ?? ""),
            winnerSubmissionId: String(payoutData.winnerSubmissionId ?? ""),
            founderId: String(payoutData.founderId ?? ""),
            builderId: String(payoutData.builderId ?? ""),
            builderName: String(payoutData.builderName ?? "Builder"),
            rewardLabel: String(payoutData.rewardLabel ?? payoutData.prizeLabel ?? "Manual payout"),
            status: (payoutData.status as Payout["status"]) ?? "Pending",
            transferReference: typeof payoutData.transferReference === "string" ? payoutData.transferReference : undefined,
            payoutNotes: typeof payoutData.payoutNotes === "string" ? payoutData.payoutNotes : undefined,
            createdAt: typeof payoutData.createdAt === "string" ? payoutData.createdAt : new Date().toISOString(),
            paidAt: typeof payoutData.paidAt === "string" ? payoutData.paidAt : undefined,
          };
          setPayout(normalizedPayout);
          setTransferReference(normalizedPayout.transferReference || "");
          setPayoutNotes(normalizedPayout.payoutNotes || "");
        }
      } catch {
        // Ignore payout load errors here to keep review screen usable.
      } finally {
        setLoadingPayout(false);
      }
    };
    fetchPayout();
  }, [id]);

  if (challengeLoading || subsLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (!challenge) {
    return <div className="p-12 text-center text-muted-foreground">Challenge not found.</div>;
  }

  if (user?.uid !== challenge.founderId) {
    return <div className="p-12 text-center text-destructive">Unauthorized. You did not create this challenge.</div>;
  }

  const handleMarkWinner = async (sub: Submission) => {
    const scoreVal = parseInt(scores[sub.id] || "100", 10);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      toast({ title: "Invalid score", description: "Score must be between 0 and 100.", variant: "destructive" });
      return;
    }

    const feedbackVal = feedbacks[sub.id];
    if (!feedbackVal) {
      toast({ title: "Feedback required", description: "Please select a feedback option.", variant: "destructive" });
      return;
    }

    const rewardSummary = challenge.rewardLabel ? ` Reward: ${challenge.rewardType} - ${challenge.rewardLabel}.` : "";
    if (!window.confirm(`Are you sure you want to mark ${sub.talentName} as the winner? This will close the challenge and award ${challenge.xpReward} XP.${rewardSummary}`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const batch = writeBatch(db);
      
      // Update the winning submission
      batch.update(doc(db, "submissions", sub.id), { 
        status: "Winner", 
        score: scoreVal,
        feedback: feedbackVal 
      });
      
      // Update challenge
      batch.update(doc(db, "challenges", challenge.id), { status: "Completed" });

      // Update talent's profile
      batch.update(doc(db, "users", sub.talentId), {
        xp: increment(challenge.xpReward),
        wins: increment(1)
      });

      await batch.commit();

      if (challenge.rewardType === "Money") {
        const payoutRef = await addDoc(collection(db, "payouts"), {
          challengeId: challenge.id,
          winnerSubmissionId: sub.id,
          founderId: challenge.founderId,
          builderId: sub.talentId,
          builderName: sub.talentName,
          rewardLabel: challenge.rewardLabel || "Manual payout",
          status: "Pending",
          createdAt: serverTimestamp(),
        });

        setPayout({
          id: payoutRef.id,
          challengeId: challenge.id,
          winnerSubmissionId: sub.id,
          founderId: challenge.founderId,
          builderId: sub.talentId,
          builderName: sub.talentName,
          rewardLabel: challenge.rewardLabel || "Manual payout",
          status: "Pending",
          createdAt: new Date().toISOString(),
        });
      }
      toast({ title: "Challenge Completed", description: `${sub.talentName} has been declared the winner!` });
      navigate(`/dashboard/founder/challenges/${challenge.id}/manage`);
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An unknown error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkPayoutPaid = async () => {
    if (!payout) return;
    if (!transferReference.trim()) {
      toast({ title: "Transfer reference required", description: "Add bank transfer ID / UTR / transaction reference.", variant: "destructive" });
      return;
    }
    setIsUpdatingPayout(true);
    try {
      await updateDoc(doc(db, "payouts", payout.id), {
        status: "Paid",
        transferReference: transferReference.trim(),
        payoutNotes: payoutNotes.trim(),
        paidAt: serverTimestamp(),
      });
      setPayout({
        ...payout,
        status: "Paid",
        transferReference: transferReference.trim(),
        payoutNotes: payoutNotes.trim(),
        paidAt: new Date().toISOString(),
      });
      toast({ title: "Payout marked paid", description: "Manual transfer has been recorded successfully." });
    } catch (error) {
      toast({ title: "Could not update payout", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally {
      setIsUpdatingPayout(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/dashboard/founder" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="glass p-6">
        <h1 className="font-heading text-2xl font-bold mb-2">Manage: {challenge.title}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Status: <strong className={challenge.status === 'Completed' ? '' : 'text-primary'}>{challenge.status}</strong></span>
          <span>Submissions: <strong>{submissions?.length || 0}</strong></span>
          <span>Reward: <strong>{challenge.xpReward} XP</strong></span>
        </div>
      </div>

      {challenge.status === "Completed" && challenge.rewardType === "Money" && !loadingPayout && (
        <div className="glass p-6 space-y-4">
          <h2 className="font-heading text-xl font-semibold">Manual Payout Transfer</h2>
          {!payout ? (
            <p className="text-sm text-muted-foreground">No payout record found for this challenge winner.</p>
          ) : (
            <>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Winner: <span className="text-foreground font-medium">{payout.builderName}</span></p>
                <p>Reward: <span className="text-foreground font-medium">{payout.rewardLabel}</span></p>
                <p>Status: <span className={payout.status === "Paid" ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>{payout.status}</span></p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Transfer Reference</label>
                  <Input
                    placeholder="UTR / Txn ID / Bank Ref"
                    value={transferReference}
                    onChange={(event) => setTransferReference(event.target.value)}
                    disabled={payout.status === "Paid" || isUpdatingPayout}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Payout Notes</label>
                  <Input
                    placeholder="e.g. IMPS sent to builder account"
                    value={payoutNotes}
                    onChange={(event) => setPayoutNotes(event.target.value)}
                    disabled={payout.status === "Paid" || isUpdatingPayout}
                  />
                </div>
              </div>
              {payout.status === "Paid" && (
                <p className="text-xs text-emerald-400">Paid on {payout.paidAt ? new Date(payout.paidAt).toLocaleString() : "recorded"}.</p>
              )}
              {payout.status !== "Paid" && (
                <Button onClick={handleMarkPayoutPaid} disabled={isUpdatingPayout}>
                  {isUpdatingPayout ? <Loader2 size={14} className="mr-2 animate-spin" /> : null}
                  Mark Payout as Paid
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {challenge.status === "Completed" && challenge.rewardType !== "Money" && (
        <div className="glass p-6">
          <h2 className="font-heading text-xl font-semibold mb-2">Reward Outcome</h2>
          <p className="text-sm text-muted-foreground">
            Reward Type: <span className="text-foreground font-medium">{challenge.rewardType}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Details: <span className="text-foreground font-medium">{challenge.rewardLabel || "Not specified"}</span>
          </p>
          {challenge.rewardType === "Hire" && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <p className="text-xs text-muted-foreground mb-1">Position</p>
                <p className="text-foreground font-medium">{challenge.hireRewardDetails?.position || "Not specified"}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <p className="text-xs text-muted-foreground mb-1">Compensation</p>
                <p className="text-foreground font-medium">{challenge.hireRewardDetails?.compensation || "Not specified"}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <p className="text-xs text-muted-foreground mb-1">Responsibilities</p>
                <p className="text-foreground">{challenge.hireRewardDetails?.responsibilities || "Not specified"}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/20 p-3">
                <p className="text-xs text-muted-foreground mb-1">Skills Required</p>
                <p className="text-foreground">{challenge.hireRewardDetails?.skillsRequired || "Not specified"}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-heading text-xl font-semibold">Submissions</h2>
        
        {submissions?.length === 0 ? (
          <div className="glass p-12 text-center text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          submissions?.map(sub => (
            <div key={sub.id} className="glass p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                    {sub.talentAvatar}
                  </div>
                  <span className="font-bold text-foreground">{sub.talentName}</span>
                  <span className="text-xs text-muted-foreground">• {new Date(sub.submittedAt).toLocaleDateString()}</span>
                  {sub.status === "Winner" && (
                     <span className="ml-2 flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                       <Trophy size={12} /> Winner
                     </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{sub.summary}</p>
                <a href={sub.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 w-fit">
                  <ExternalLink size={12} /> View Work
                </a>
                <Link to="/dashboard/founder/messages" className="text-xs text-primary hover:underline flex items-center gap-1 w-fit mt-2">
                  <MessageSquare size={12} /> Message Builder
                </Link>
              </div>

              {challenge.status !== "Completed" && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-background/50 p-3 rounded-xl border border-white/5 mt-4 sm:mt-0">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Score (0-100)</label>
                    <Input 
                      type="number" 
                      min="0" max="100" 
                      className="w-full sm:w-20 h-9 bg-secondary/50 border-border" 
                      placeholder="100"
                      value={scores[sub.id] !== undefined ? scores[sub.id] : ""}
                      onChange={(e) => setScores(s => ({ ...s, [sub.id]: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-1 flex-1 min-w-[150px]">
                    <label className="text-xs text-muted-foreground">Feedback</label>
                    <select 
                      className="flex h-9 w-full rounded-md border border-input bg-secondary/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={feedbacks[sub.id] || ""}
                      onChange={(e) => setFeedbacks(f => ({ ...f, [sub.id]: e.target.value }))}
                    >
                      <option value="" disabled>Select feedback...</option>
                      {FEEDBACK_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    onClick={() => handleMarkWinner(sub)} 
                    disabled={isSubmitting}
                    className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 h-9 sm:mt-5 whitespace-nowrap w-full sm:w-auto"
                  >
                    <Trophy size={14} className="mr-2" /> Mark Winner
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageChallenge;
