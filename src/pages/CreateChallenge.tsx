import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, DIFFICULTIES } from "@/types/challenge";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

interface CriterionForm {
  name: string;
  weight: string;
  description: string;
}

const CreateChallenge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("15");
  const [prize, setPrize] = useState("");
  const [xpReward, setXpReward] = useState("500");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [criteria, setCriteria] = useState<CriterionForm[]>([
    { name: "", weight: "25", description: "" },
  ]);

  const addRequirement = () => setRequirements([...requirements, ""]);
  const removeRequirement = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i));
  const updateRequirement = (i: number, val: string) => {
    const copy = [...requirements];
    copy[i] = val;
    setRequirements(copy);
  };

  const addCriterion = () => setCriteria([...criteria, { name: "", weight: "25", description: "" }]);
  const removeCriterion = (i: number) => setCriteria(criteria.filter((_, idx) => idx !== i));
  const updateCriterion = (i: number, field: keyof CriterionForm, val: string) => {
    const copy = [...criteria];
    copy[i] = { ...copy[i], [field]: val };
    setCriteria(copy);
  };

  const totalWeight = criteria.reduce((sum, c) => sum + (parseInt(c.weight) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!title || !description || !category || !difficulty || !deadline) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (totalWeight !== 100) {
      toast({ title: "Scoring weights must total 100%", description: `Currently at ${totalWeight}%.`, variant: "destructive" });
      return;
    }

    // Pricing limit check
    const snap = await getDoc(doc(db, "users", user.uid));
    const userData = snap.data();
    if (userData?.subscriptionTier !== 'pro' && (userData?.challengeCount ?? 0) >= 1) {
      toast({ 
        title: "Limit reached", 
        description: "Starter Trial founders can only post 1 challenge. Upgrade to Founder Pro for unlimited access!", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Save challenge
      await addDoc(collection(db, "challenges"), {
        title,
        description,
        category,
        difficulty,
        deadline,
        maxParticipants: parseInt(maxParticipants),
        prize,
        xpReward: parseInt(xpReward),
        requirements: requirements.filter(r => r.trim() !== ""),
        criteria: criteria.map(c => ({
          ...c,
          weight: parseInt(c.weight)
        })),
        founderId: user.uid,
        participantsCount: 0,
        status: "open",
        createdAt: serverTimestamp(),
      });

      // 2. Increment user's challenge count (to support firestore rules limits)
      await updateDoc(doc(db, "users", user.uid), {
        challengeCount: increment(1)
      });

      toast({ title: "Challenge created!", description: "Your challenge is now live." });
      navigate("/dashboard/founder/challenges");
    } catch (err: unknown) {
      const error = err as Error;
      toast({ 
        title: "Error creating challenge", 
        description: error.message || "Something went wrong.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/founder/challenges">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Create Challenge</h1>
          <p className="text-muted-foreground text-sm">Define a real problem for talent to solve.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-foreground">
        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 space-y-4">
          <h2 className="font-heading font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <Label>Challenge Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a Real-Time Dashboard" className="bg-secondary/30 border-border" required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the challenge in detail..." rows={5} className="bg-secondary/30 border-border" required disabled={loading} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory} disabled={loading}>
                <SelectTrigger className="bg-secondary/30 border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty} disabled={loading}>
                <SelectTrigger className="bg-secondary/30 border-border">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-secondary/30 border-border" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Max Participants</Label>
              <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} className="bg-secondary/30 border-border" disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Prize</Label>
              <Input value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="$2,500" className="bg-secondary/30 border-border" disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>XP Reward</Label>
            <Input type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)} className="bg-secondary/30 border-border max-w-[200px]" disabled={loading} />
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold">Requirements</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addRequirement} className="text-primary hover:text-primary/80" disabled={loading}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {requirements.map((req, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={req}
                onChange={(e) => updateRequirement(i, e.target.value)}
                placeholder={`Requirement ${i + 1}`}
                className="bg-secondary/30 border-border"
                disabled={loading}
              />
              {requirements.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeRequirement(i)} className="text-muted-foreground hover:text-destructive flex-shrink-0" disabled={loading}>
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </motion.div>

        {/* Scoring Criteria */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-semibold">Scoring Criteria</h2>
              <p className={`text-xs mt-0.5 ${totalWeight === 100 ? "text-primary" : "text-destructive"}`}>
                Total weight: {totalWeight}% {totalWeight !== 100 && "(must equal 100%)"}
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={addCriterion} className="text-primary hover:text-primary/80" disabled={loading}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>

          {criteria.map((c, i) => (
            <div key={i} className="glass-subtle p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Criterion {i + 1}</span>
                {criteria.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCriterion(i)} className="text-muted-foreground hover:text-destructive h-6 w-6" disabled={loading}>
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-[1fr,80px] gap-3">
                <Input value={c.name} onChange={(e) => updateCriterion(i, "name", e.target.value)} placeholder="e.g. Code Quality" className="bg-secondary/30 border-border" disabled={loading} />
                <Input type="number" value={c.weight} onChange={(e) => updateCriterion(i, "weight", e.target.value)} placeholder="%" className="bg-secondary/30 border-border" disabled={loading} />
              </div>
              <Input value={c.description} onChange={(e) => updateCriterion(i, "description", e.target.value)} placeholder="Describe what you're scoring..." className="bg-secondary/30 border-border" disabled={loading} />
            </div>
          ))}
        </motion.div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link to="/dashboard/founder/challenges">
            <Button type="button" variant="outline" className="border-border text-foreground hover:bg-secondary" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-11" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Publish Challenge"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallenge;
