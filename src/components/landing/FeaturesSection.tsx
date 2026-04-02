import { motion } from "framer-motion";
import { Shield, Trophy, Rocket, BarChart3, Users, Sparkles } from "lucide-react";

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
    <section id="features" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Features</span>
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
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass p-6 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
