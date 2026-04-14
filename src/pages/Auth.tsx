"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

type Role = "talent" | "founder";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("talent");

  // After Google OAuth: if user has no role yet, show role picker
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [pendingOAuthRole, setPendingOAuthRole] = useState<Role>("talent");
  const [pendingUid, setPendingUid] = useState<string | null>(null);

  const { user, role: authRole } = useAuth();
  const navigate = useNavigate();

  // Redirect once role is known
  useEffect(() => {
    if (user && authRole && !showRolePicker) {
      navigate(authRole === "founder" ? "/dashboard/founder" : "/dashboard");
    }
  }, [user, authRole, showRolePicker, navigate]);

  // ─── Email / Password auth ─────────────────────────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
          name,
          email,
          role: selectedRole,
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Account created!",
          description: `Welcome to Soho Space as a ${selectedRole === "founder" ? "Founder" : "Builder"}!`,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome back!", description: "Redirecting…" });
      }
      // AuthProvider re-fetches role → useEffect handles redirect
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Authentication error",
        description: err.message || "Failed to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;

      // Check if user already has a role in Firestore
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        // Role already set — useEffect will redirect via authRole
        toast({ title: "Welcome back!", description: "Redirecting…" });
      } else {
        // New Google user — ask them to pick a role
        setPendingUid(uid);
        setShowRolePicker(true);
      }
    } catch (error: unknown) {
      const err = error as Error;
      // Ignore popup-closed errors
      if ((err as any)?.code !== "auth/popup-closed-by-user") {
        toast({
          title: "Google sign-in failed",
          description: err.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Confirm role after OAuth ──────────────────────────────────────────────
  const handleConfirmOAuthRole = async () => {
    if (!pendingUid || !auth.currentUser) return;
    setLoading(true);
    try {
      const u = auth.currentUser;
      await setDoc(doc(db, "users", pendingUid), {
        name: u.displayName ?? u.email ?? "User",
        email: u.email ?? "",
        role: pendingOAuthRole,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "You're all set!",
        description: `Welcome to Soho Space as a ${pendingOAuthRole === "founder" ? "Founder" : "Builder"}!`,
      });
      setShowRolePicker(false);
      // AuthProvider will pick up the new Firestore doc → re-fetch role → redirect
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Error saving profile",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Role picker card (shown after Google sign-in for new users) ───────────
  if (showRolePicker) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
        <InfiniteGrid className="opacity-60" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="glass shadow-[0_20px_50px_rgba(255,127,80,0.15)] border-primary/20 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading font-bold gradient-text">
                One last step!
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                How would you like to use Soho Space?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPendingOAuthRole("talent")}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                    pendingOAuthRole === "talent"
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  }`}
                >
                  <Hammer className="h-6 w-6" />
                  <span className="text-sm font-semibold">Builder / Talent</span>
                  <span className="text-[10px] text-center opacity-70">Solve challenges &amp; earn XP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPendingOAuthRole("founder")}
                  className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                    pendingOAuthRole === "founder"
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  }`}
                >
                  <Briefcase className="h-6 w-6" />
                  <span className="text-sm font-semibold">Founder</span>
                  <span className="text-[10px] text-center opacity-70">Post challenges &amp; find talent</span>
                </button>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 h-11 mt-2"
                disabled={loading}
                onClick={handleConfirmOAuthRole}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <>
                    Continue as {pendingOAuthRole === "founder" ? "Founder" : "Builder"}
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── Main auth form ────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden">
      <InfiniteGrid className="opacity-60" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass shadow-[0_20px_50px_rgba(255,127,80,0.15)] border-primary/20 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />

          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="flex justify-center mb-4"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-primary/30">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-heading font-bold gradient-text">Soho Space</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Join the elite builders network
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ── Google SSO ── */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border hover:bg-secondary flex items-center gap-3 mb-6"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
            >
              {googleLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <svg viewBox="0 0 48 48" className="w-4 h-4 flex-shrink-0">
                  <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.3 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z" />
                  <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3 0 5.7 1.1 7.8 2.9l6-6C34.4 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z" />
                  <path fill="#FBBC05" d="M24 44c5.5 0 10.4-1.9 14.2-5l-6.5-5.3C29.7 35.3 27 36 24 36c-5.7 0-10.2-2.7-11.7-7.5l-7 5.4C8.8 40.3 15.9 44 24 44z" />
                  <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.3c3.8-3.5 6-8.7 6-15.5 0-1.3-.1-2.7-.2-4z" />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or with email</span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 border-border">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:text-primary">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-background data-[state=active]:text-primary">Sign Up</TabsTrigger>
              </TabsList>

              {/* ── Login ── */}
              <TabsContent value="login">
                <form onSubmit={handleAuth} className="space-y-4" autoComplete="on">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-background/50 border-border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        className="pl-10 bg-background/50 border-border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Access Dashboard"}
                    {!loading && <ArrowRight className="ml-2" size={18} />}
                  </Button>
                </form>
              </TabsContent>

              {/* ── Register ── */}
              <TabsContent value="register">
                <form onSubmit={handleAuth} className="space-y-4" autoComplete="on">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        autoComplete="name"
                        placeholder="John Doe"
                        className="pl-10 bg-background/50 border-border"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-background/50 border-border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type="password"
                        autoComplete="new-password"
                        className="pl-10 bg-background/50 border-border"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Role picker */}
                  <div className="space-y-2 pt-1">
                    <Label>I am joining as a:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRole("talent")}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedRole === "talent"
                            ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        <Hammer className="h-4 w-4" />
                        <span className="text-xs font-semibold">Builder / Talent</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole("founder")}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedRole === "founder"
                            ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                            : "border-border hover:border-primary/50 text-muted-foreground"
                        }`}
                      >
                        <Briefcase className="h-4 w-4" />
                        <span className="text-xs font-semibold">Founder</span>
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 mt-2" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : `Join as ${selectedRole === "founder" ? "Founder" : "Builder"}`}
                    {!loading && <CheckCircle2 className="ml-2" size={18} />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col text-center pt-0">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to Soho Space's{" "}
              <span className="underline cursor-pointer">Terms</span> and{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </CardFooter>
        </Card>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowRight className="rotate-180" size={14} />
            Back to Landing
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
