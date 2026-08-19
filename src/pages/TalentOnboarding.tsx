import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, MapPin, Github, Twitter, Globe, Zap, Briefcase, SearchX, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const SKILL_OPTIONS = [
  "Frontend", "Backend", "Full-Stack", "Mobile", "DevOps",
  "AI/ML", "Design", "Growth", "Marketing", "Product", "Data", "Blockchain",
];

export default function TalentOnboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<"employed" | "freelance" | "unemployed" | "">();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (selectedSkills.length === 0) {
      toast({ title: "Pick at least one skill", variant: "destructive" });
      return;
    }
    if (!currentStatus) {
      toast({ title: "Select your current status", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const initials = (user.displayName ?? user.email ?? "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      await updateDoc(doc(db, "users", user.uid), {
        bio,
        location,
        github,
        twitter,
        portfolio,
        skills: selectedSkills,
        currentStatus,
        avatarInitials: initials,
        xp: 0,
        wins: 0,
        streak: 0,
        level: "Rookie",
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      });

      // Refresh auth context so ProtectedRoute sees onboardingComplete=true
      await refreshProfile();

      toast({ title: "Profile created!", description: "Welcome to Soho Space 🚀" });
      navigate("/dashboard");
    } catch (err: unknown) {
      toast({ title: "Error saving profile", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Zap size={12} /> Builder Profile Setup
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Build your <span className="gradient-text">identity</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">This is your public-facing builder profile. Make it count.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass p-6 rounded-2xl">
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              placeholder="I build fast, ship faster. Full-stack dev with a love for product."
              className="bg-background/50 border-border resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Mumbai, India"
                className="pl-10 bg-background/50 border-border"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Your Skills <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    selectedSkills.includes(skill)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="space-y-2">
            <Label>Current Status <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "employed",   label: "Employed",   icon: Briefcase, desc: "Working full-time" },
                { value: "freelance",  label: "Freelance",  icon: Laptop,    desc: "Independent work" },
                { value: "unemployed", label: "Unemployed", icon: SearchX,   desc: "Open to opportunities" },
              ] as const).map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrentStatus(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                    currentStatus === value
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[10px] text-center opacity-70 leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  placeholder="github.com/you"
                  className="pl-10 bg-background/50 border-border text-sm"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  placeholder="@handle"
                  className="pl-10 bg-background/50 border-border text-sm"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="portfolio"
                  placeholder="yoursite.com"
                  className="pl-10 bg-background/50 border-border text-sm"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 h-11 mt-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <>Complete My Profile <ArrowRight className="ml-2" size={18} /></>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
