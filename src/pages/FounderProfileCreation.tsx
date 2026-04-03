"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Globe, 
  User, 
  FileText, 
  Camera, 
  ArrowRight, 
  CheckCircle2,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const FounderProfileCreation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    bio: "",
    founderName: "",
    avatar: "🏢"
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Created!",
        description: "Welcome to the founder community.",
      });
      navigate("/dashboard/founder");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden font-body">
      <InfiniteGrid className="opacity-40" />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="glass border-primary/20 shadow-2xl shadow-primary/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl shadow-xl shadow-primary/20">
                <Rocket className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-heading font-bold gradient-text">Founder Profile</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Tell us about yourself and your vision.
            </CardDescription>
            
            {/* Step Progress */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {[1, 2].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 w-12 rounded-full transition-all duration-300 ${
                    step >= s ? "bg-primary" : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form className="space-y-6">
              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Building2 size={14} className="text-primary" /> Company Name
                      </Label>
                      <Input 
                        placeholder="Acme Corp" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="bg-background/50 border-border" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe size={14} className="text-primary" /> Website
                      </Label>
                      <Input 
                        placeholder="https://acme.com" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="bg-background/50 border-border" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Rocket size={14} className="text-primary" /> Industry
                    </Label>
                    <Input 
                      placeholder="e.g. AI & SaaS" 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="bg-background/50 border-border" 
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2 text-center mb-6">
                    <Label className="block mb-2 text-muted-foreground">Founder Avatar</Label>
                    <div className="flex justify-center gap-4">
                      {["🏢", "🚀", "💡", "🎨", "💻"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({...formData, avatar: emoji})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                            formData.avatar === emoji 
                            ? "bg-primary/20 border-2 border-primary scale-110" 
                            : "bg-secondary/50 border border-border hover:bg-secondary"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User size={14} className="text-primary" /> Founder Name
                    </Label>
                    <Input 
                      placeholder="Jane Cooper" 
                      value={formData.founderName}
                      onChange={(e) => setFormData({...formData, founderName: e.target.value})}
                      className="bg-background/50 border-border" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> Bio / Vision
                    </Label>
                    <Textarea 
                      placeholder="I'm building the future of..." 
                      rows={4} 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="bg-background/50 border-border"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(step - 1)}
                    className="flex-1 border-border"
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    "Saving..."
                  ) : step === 2 ? (
                    <>Complete Profile <CheckCircle2 className="ml-2" size={18} /></>
                  ) : (
                    <>Next Step <ArrowRight className="ml-2" size={18} /></>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FounderProfileCreation;
