import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight, MapPin, Twitter, Linkedin, Globe, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const INDUSTRY_OPTIONS = [
  "SaaS", "Fintech", "HealthTech", "EdTech", "E-Commerce",
  "AI/ML", "Web3", "DevTools", "Consumer", "B2B", "Gaming", "CleanTech",
];

export default function FounderOnboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [bio, setBio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedIndustry) {
      toast({ title: "Pick your industry", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const initials = (companyName || user.displayName || user.email || "F")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      await updateDoc(doc(db, "users", user.uid), {
        bio,
        companyName,
        companyWebsite,
        industry: selectedIndustry,
        location,
        twitter,
        linkedin,
        avatarInitials: initials,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      });

      // Refresh auth context so ProtectedRoute sees onboardingComplete=true
      await refreshProfile();

      toast({ title: "Company profile created!", description: "Start posting challenges now 🚀" });
      navigate("/dashboard/founder");
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4">
            <Briefcase size={12} /> Founder Profile Setup
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Set up your <span className="gradient-text">company</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Tell builders who you are. A complete profile attracts better talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass p-6 rounded-2xl">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company / Startup Name <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                placeholder="Acme Inc."
                className="pl-10 bg-background/50 border-border"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">What does your company do?</Label>
            <Textarea
              id="bio"
              placeholder="We're building the future of B2B SaaS payments for emerging markets."
              className="bg-background/50 border-border resize-none"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label>Industry <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_OPTIONS.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    selectedIndustry === ind
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Location + Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="location">Headquarters</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  className="pl-10 bg-background/50 border-border"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyWebsite"
                  placeholder="acme.com"
                  className="pl-10 bg-background/50 border-border"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  placeholder="@acme"
                  className="pl-10 bg-background/50 border-border text-sm"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/company/acme"
                  className="pl-10 bg-background/50 border-border text-sm"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
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
              <>Launch My Founder Portal <ArrowRight className="ml-2" size={18} /></>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
