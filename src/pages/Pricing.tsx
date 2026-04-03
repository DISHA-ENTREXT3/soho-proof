import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-background overflow-x-hidden">
    <div className="fixed inset-0 z-0 opacity-100 pointer-events-none">
      <InfiniteGrid className="!bg-transparent" />
    </div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

const Pricing = () => {
  return (
    <Container>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Elite Access for <span className="gradient-text">Elite Minds</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the path that fits your mission. Transparent pricing for both visionary founders and world-class builders.
          </p>
        </div>

        {/* Founders Plans */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border">
            <Shield className="text-primary" size={28} />
            <h2 className="font-heading text-3xl font-bold">For Founders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Founder Basic */}
            <motion.div 
               whileHover={{ y: -10 }}
               className="glass p-10 rounded-3xl border-primary/10 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">Startup Proof</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-heading font-bold">$499</span>
                  <span className="text-muted-foreground">/challenge</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Post 1 tracked challenge", "Custom evaluation criteria", "Access to top 1% applicants", "Automated score grading"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={16} className="text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Hire Now</Button>
            </motion.div>

            {/* Founder Pro */}
            <motion.div 
               whileHover={{ y: -10 }}
               className="glass p-10 rounded-3xl border-primary/40 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground transform rotate-45 translate-x-3 translate-y-3">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Alpha Pipeline</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-heading font-bold">$2,490</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited challenges", "Priority talent matching", "Dedicated account manager", "White-glove evaluation support", "Custom talent proof API"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={16} className="text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">Scale Your Team</Button>
            </motion.div>
          </div>
        </div>

        {/* Talent Plans */}
        <div>
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border">
            <Zap className="text-primary" size={28} />
            <h2 className="font-heading text-3xl font-bold">For Alpha Builders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {/* Talent Free */}
             <motion.div 
               whileHover={{ y: -10 }}
               className="glass p-10 rounded-3xl border-border flex flex-col justify-between opacity-80"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">Explorer</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-heading font-bold">$0</span>
                  <span className="text-muted-foreground">/free</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Browse active challenges", "Submit up to 2 entries/mo", "Public proof profile", "Standard XP gain"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={16} className="text-primary/40" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" size="lg" className="w-full border-border">Stay Free</Button>
            </motion.div>

            {/* Talent Pro */}
            <motion.div 
               whileHover={{ y: -10 }}
               className="glass p-10 rounded-3xl border-primary/20 flex flex-col justify-between"
            >
              <div>
                <dt className="w-fit px-3 py-1 bg-primary/10 rounded-full text-[10px] text-primary font-bold uppercase tracking-widest mb-3">Premium</dt>
                <h3 className="text-xl font-bold mb-2">Alpha Builder Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-heading font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited challenge entries", "Early access to top-tier bounties", "Advanced skill graph deep-dive", "Priority verified status badge", "Direct-to-Founder DM access"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium">
                      <Crown size={16} className="text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">Unlock Mastery</Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Pricing;
