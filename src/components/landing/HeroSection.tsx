import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { SocialLinks } from "@/components/ui/SocialLinks";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs text-primary font-medium mb-8"
          >
            <Zap size={12} />
            Proof-of-Execution Hiring
          </motion.div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 text-balance">
            Hire by{" "}
            <span className="gradient-text">Proof</span>
            <br />
            Not Promises
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Founders post real challenges. Talent executes. The best work wins.
            No resumes, no interviews — just proof of what you can do.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary px-8 h-12 text-base">
              Start Building
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary h-12 px-8 text-base">
              Post a Challenge
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 flex flex-col items-center justify-center gap-6"
          >
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span>500+ Challenges</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>2,000+ Builders</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>$1M+ Awarded</span>
            </div>
            
            <SocialLinks />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
