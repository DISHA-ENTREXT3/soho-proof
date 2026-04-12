"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider
} from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        toast({
          title: "Account created!",
          description: "Welcome to Soho Space!",
        });
        navigate("/dashboard");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome back!",
          description: "Redirecting to dashboard...",
        });
        navigate("/dashboard");
      }
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
            <Tabs defaultValue="login" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 border-border">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:text-primary">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-background data-[state=active]:text-primary">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email"
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
                      <Label htmlFor="password">Password</Label>
                      <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
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
              
              <TabsContent value="register">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <Input 
                      id="reg-name" 
                      placeholder="John Doe" 
                      className="bg-background/50 border-border" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      className="bg-background/50 border-border" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      className="bg-background/50 border-border" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : "Create Account"}
                    {!loading && <CheckCircle2 className="ml-2" size={18} />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-border hover:bg-secondary">
                <Github size={18} className="mr-2" />
                GitHub
              </Button>
              <Button variant="outline" className="border-border hover:bg-secondary">
                <Chrome size={18} className="mr-2" />
                Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col text-center pt-2">
             <p className="text-xs text-muted-foreground">
              By continuing, you agree to Soho Space's <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
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
