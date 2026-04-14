import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Lock, Globe, Shield,
  CreditCard, Mail, Save, Loader2, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import type { TalentProfile, FounderProfile } from "@/hooks/use-profile";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const DashboardSettings = () => {
  const { user, role, refreshProfile } = useAuth();
  const { profile, profileLoading, initials } = useProfile();

  const isFounder = role === "founder";
  const tp = profile as TalentProfile | null;
  const fp = profile as FounderProfile | null;

  // Profile form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [saving, setSaving] = useState(false);

  // Pre-fill from Firestore profile
  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setBio(profile.bio ?? "");
    setLocation(profile.location ?? "");
    setTwitter(profile.twitter ?? "");
    if (!isFounder) {
      setGithub(tp?.github ?? "");
      setPortfolio(tp?.portfolio ?? "");
    } else {
      setCompanyName(fp?.companyName ?? "");
      setCompanyWebsite(fp?.companyWebsite ?? "");
      setLinkedin(fp?.linkedin ?? "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const update: Record<string, string> = {
        name, bio, location, twitter, updatedAt: "" as unknown as string,
      };
      if (!isFounder) {
        update.github = github;
        update.portfolio = portfolio;
      } else {
        update.companyName = companyName;
        update.companyWebsite = companyWebsite;
        update.linkedin = linkedin;
      }

      await updateDoc(doc(db, "users", user.uid), {
        ...update,
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch (err: unknown) {
      toast({ title: "Error saving", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account, privacy, and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary/50 border border-white/5 p-1 h-12 rounded-xl mb-8">
          <TabsTrigger value="profile" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Lock className="w-4 h-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* ── Profile tab ── */}
        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-primary/20">
                  {initials}
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="settings-name">Full Name</Label>
                    <Input
                      id="settings-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/30 border-white/5"
                    />
                  </div>
                  {isFounder && (
                    <div className="space-y-2">
                      <Label htmlFor="settings-company">Company Name</Label>
                      <Input
                        id="settings-company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settings-bio">Bio</Label>
                  <Textarea
                    id="settings-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-secondary/30 border-white/5 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="settings-location">Location</Label>
                  <Input
                    id="settings-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-secondary/30 border-white/5"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Online Presence
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {!isFounder ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="settings-portfolio">Portfolio / Website</Label>
                      <Input
                        id="settings-portfolio"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                        placeholder="yoursite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-github">GitHub</Label>
                      <Input
                        id="settings-github"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                        placeholder="github.com/you"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="settings-website">Company Website</Label>
                      <Input
                        id="settings-website"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                        placeholder="acme.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-linkedin">LinkedIn</Label>
                      <Input
                        id="settings-linkedin"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="bg-secondary/30 border-white/5"
                        placeholder="linkedin.com/company/acme"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="settings-twitter">Twitter / X</Label>
                  <Input
                    id="settings-twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="bg-secondary/30 border-white/5"
                    placeholder="@handle"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* ── Account tab ── */}
        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass p-8 space-y-6">
            <h3 className="font-heading font-bold text-xl">Account Security</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="settings-email"
                    value={user?.email ?? ""}
                    disabled
                    className="bg-secondary/10 border-white/5 flex-1"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" /> Your email is verified and protected.
                </p>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4 py-2">
                <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Extra layer of security</p>
                    <p className="text-xs text-muted-foreground">Keep your account secure with 2FA.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 border-rose-500/10">
            <h3 className="font-heading font-bold text-xl text-rose-500">Danger Zone</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Permanently delete your account and all associated data.</p>
            <Button variant="outline" className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors">
              Delete Account
            </Button>
          </div>
        </TabsContent>

        {/* ── Notifications tab ── */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass p-8 space-y-6">
            <div className="space-y-6">
              {[
                { title: "Challenge Updates",  desc: "Get notified when a challenge you're in has updates.", icon: Zap },
                { title: "Team Mentions",       desc: "Receive alerts when mentioned in discussions.",       icon: User },
                { title: "Direct Messages",     desc: "Notifications for new direct messages.",             icon: Mail },
                { title: "Award Alerts",        desc: "When you win or receive a reputation boost.",        icon: CreditCard },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/10 flex h-fit">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={idx < 2} />
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8">
                Update Preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardSettings;
