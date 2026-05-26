import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChallenge, useSubmissions } from "@/hooks/use-challenges";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { writeBatch, doc, increment } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Submission } from "@/types/challenge";

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

    if (!window.confirm(`Are you sure you want to mark ${sub.talentName} as the winner? This will close the challenge and award ${challenge.xpReward} XP.`)) {
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
      toast({ title: "Challenge Completed", description: `${sub.talentName} has been declared the winner!` });
      navigate("/dashboard/founder");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "An unknown error occurred", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
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
