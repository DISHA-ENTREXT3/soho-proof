import { motion } from "framer-motion";
import { Shield, Trophy, Rocket, BarChart3, Users, Sparkles } from "lucide-react";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

const features = [
  {
    icon: Shield,
    title: "Proof Over Promises",
    description: "Every hire is backed by real executed work — no guessing, no resume fluff.",
  },
  {
    icon: Trophy,
    title: "Gamified Reputation",
    description: "XP, leaderboards, and skill graphs that evolve with every challenge completed.",
  },
  {
    icon: Rocket,
    title: "Challenge Engine",
    description: "Founders post real business problems. Talent competes under real constraints.",
  },
  {
    icon: BarChart3,
    title: "Talent Proof Graph",
    description: "Visual skill profiles powered by actual submissions and peer reviews.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description: "Join a network of builders who prove their worth through execution.",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Scoring",
    description: "Smart evaluation system with extensible manual and automated scoring.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-bold">Features</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Built for{" "}
            <span className="gradient-text">Builders</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to prove your skills and get hired by the best startups.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative glass p-8 overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/10 border-border/50 hover:border-primary/40"
            >
              {/* Background Motion Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-primary/5" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed transition-colors group-hover:text-foreground/80">
                  {feature.description}
                </p>
                <div className="mt-6 w-8 h-1 bg-border group-hover:bg-primary group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
