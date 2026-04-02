import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  Zap,
  Trophy,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockChallenges, mockSubmissions } from "@/data/mockChallenges";
import type { ChallengeCategory, ChallengeStatus } from "@/types/challenge";
import { toast } from "@/hooks/use-toast";

const categoryColors: Record<ChallengeCategory, string> = {
  Tech: "bg-blue-500/20 text-blue-400",
  Growth: "bg-emerald-500/20 text-emerald-400",
  Hybrid: "bg-amber-500/20 text-amber-400",
  Design: "bg-pink-500/20 text-pink-400",
  Data: "bg-violet-500/20 text-violet-400",
};

const statusColors: Record<ChallengeStatus, string> = {
  Open: "bg-primary/20 text-primary",
  "In Progress": "bg-blue-400/20 text-blue-400",
  Judging: "bg-amber-400/20 text-amber-400",
  Completed: "bg-muted text-muted-foreground",
};

const submissionStatusIcons = {
  Pending: <Clock size={14} className="text-muted-foreground" />,
  Reviewed: <CheckCircle2 size={14} className="text-blue-400" />,
  Winner: <Trophy size={14} className="text-yellow-400" />,
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const challenge = mockChallenges.find((c) => c.id === id);
  const submissions = mockSubmissions.filter((s) => s.challengeId === id);

  const [submissionSummary, setSubmissionSummary] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!challenge) {
    return (
      <div className="max-w-3xl">
        <Link to="/dashboard/challenges" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} /> Back to Challenges
        </Link>
        <div className="glass p-12 text-center">
          <AlertCircle size={24} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Challenge not found.</p>
        </div>
      </div>
    );
  }

  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const participationPercent = (challenge.currentParticipants / challenge.maxParticipants) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionSummary || !submissionLink) {
      toast({ title: "Missing fields", description: "Please provide a summary and link.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Submission sent!", description: "Your work has been submitted for review." });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <Link to="/dashboard/challenges" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to Challenges
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={`${categoryColors[challenge.category]} border-0 text-xs`}>{challenge.category}</Badge>
          <Badge className={`${statusColors[challenge.status]} border-0 text-xs`}>{challenge.status}</Badge>
          <span className="text-xs text-muted-foreground ml-auto">{challenge.difficulty}</span>
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{challenge.title}</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">{challenge.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-subtle p-3 text-center">
            <Clock size={16} className="text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-foreground">{daysLeft}d</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div className="glass-subtle p-3 text-center">
            <Users size={16} className="text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-foreground">{challenge.currentParticipants}/{challenge.maxParticipants}</p>
            <p className="text-xs text-muted-foreground">Spots Filled</p>
          </div>
          <div className="glass-subtle p-3 text-center">
            <Zap size={16} className="text-primary mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-primary">{challenge.xpReward}</p>
            <p className="text-xs text-muted-foreground">XP Reward</p>
          </div>
          <div className="glass-subtle p-3 text-center">
            <Trophy size={16} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-heading font-bold text-foreground">{challenge.prize}</p>
            <p className="text-xs text-muted-foreground">Prize Pool</p>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Capacity</span>
            <span>{Math.round(participationPercent)}%</span>
          </div>
          <Progress value={participationPercent} className="h-1.5 bg-secondary" />
        </div>

        {/* Founder */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium text-foreground">{challenge.founderAvatar}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{challenge.founderName}</p>
            <p className="text-xs text-muted-foreground">{challenge.companyName}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="details" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Details</TabsTrigger>
          <TabsTrigger value="submit" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Submit Work</TabsTrigger>
          <TabsTrigger value="submissions" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            Submissions ({submissions.length})
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
            <h3 className="font-heading font-semibold text-foreground mb-3">Requirements</h3>
            <ul className="space-y-2">
              {challenge.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6">
            <h3 className="font-heading font-semibold text-foreground mb-3">Scoring Criteria</h3>
            <div className="space-y-3">
              {challenge.scoringCriteria.map((sc) => (
                <div key={sc.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{sc.name}</span>
                    <span className="text-xs text-primary font-medium">{sc.weight}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">{sc.description}</p>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${sc.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Submit Tab */}
        <TabsContent value="submit">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-6">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={40} className="text-primary mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Submission Received!</h3>
                <p className="text-sm text-muted-foreground">Your work is under review. You'll be notified when scoring is complete.</p>
              </div>
            ) : challenge.status === "Completed" || challenge.status === "Judging" ? (
              <div className="text-center py-8">
                <AlertCircle size={40} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Submissions Closed</h3>
                <p className="text-sm text-muted-foreground">This challenge is no longer accepting new submissions.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-semibold text-foreground">Submit Your Work</h3>
                <p className="text-sm text-muted-foreground">Provide a summary and a link to your submission.</p>

                <div className="space-y-2">
                  <Label className="text-foreground">Summary *</Label>
                  <Textarea
                    value={submissionSummary}
                    onChange={(e) => setSubmissionSummary(e.target.value)}
                    placeholder="Describe your approach, key decisions, and results..."
                    rows={4}
                    className="bg-secondary/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Link to Work *</Label>
                  <Input
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://github.com/your-repo or deployed URL"
                    className="bg-secondary/50 border-border"
                  />
                </div>

                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send size={14} className="mr-2" />
                  Submit Work
                </Button>
              </form>
            )}
          </motion.div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {submissions.length === 0 ? (
              <div className="glass p-12 text-center">
                <p className="text-muted-foreground">No submissions yet.</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className={`glass p-5 ${sub.status === "Winner" ? "border-yellow-400/30 glow-primary" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">{sub.talentAvatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{sub.talentName}</p>
                      <p className="text-xs text-muted-foreground">Submitted {sub.submittedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submissionStatusIcons[sub.status]}
                      <span className="text-xs text-muted-foreground">{sub.status}</span>
                      {sub.score != null && (
                        <span className="text-sm font-heading font-bold text-primary ml-2">{sub.score}/100</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{sub.summary}</p>
                  <a href={sub.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink size={12} /> View Work
                  </a>
                </div>
              ))
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengeDetail;
