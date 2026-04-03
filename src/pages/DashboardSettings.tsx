import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Shield, 
  CreditCard,
  Mail,
  Camera,
  Save,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const DashboardSettings = () => {
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

        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-white/5 shadow-2xl">
                  <AvatarFallback className="text-2xl bg-secondary">JD</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" className="bg-secondary/30 border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" defaultValue="Full Stack Engineer" className="bg-secondary/30 border-white/5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue="Passionate builder specializing in high-performance web applications and distributed systems." 
                    className="bg-secondary/30 border-white/5 min-h-[100px]"
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
                <div className="space-y-2">
                  <Label htmlFor="website">Website / Portfolio</Label>
                  <Input id="website" placeholder="https://yourportfolio.com" className="bg-secondary/30 border-white/5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input id="github" placeholder="https://github.com/username" className="bg-secondary/30 border-white/5" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass p-8 space-y-6">
            <h3 className="font-heading font-bold text-xl">Account Security</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <Input id="email" defaultValue="john.doe@example.com" disabled className="bg-secondary/10 border-white/5 flex-1" />
                  <Button variant="outline" className="border-white/5 h-10">Change</Button>
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
              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="glass p-8 space-y-6">
            <div className="space-y-6">
              {[
                { title: "Challenge Updates", desc: "Get notified when a challenge you're in has updates.", icon: Zap },
                { title: "Team Mentions", desc: "Receive alerts when mentioned in discussions.", icon: User },
                { title: "Direct Messages", desc: "Notifications for new direct messages.", icon: Mail },
                { title: "Award Alerts", desc: "When you win or receive a reputation boost.", icon: CreditCard },
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
