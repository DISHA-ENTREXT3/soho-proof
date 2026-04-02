import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";

const phases = [
  {
    phase: "Q1 2026",
    title: "Foundation",
    items: ["Challenge Engine", "User Profiles & Auth", "Submission System", "Basic Scoring"],
    done: true,
  },
  {
    phase: "Q2 2026",
    title: "Growth",
    items: ["Reputation & XP System", "Leaderboards", "Talent Proof Graph", "Founder Dashboard"],
    done: false,
  },
  {
    phase: "Q3 2026",
    title: "Scale",
    items: ["AI-Assisted Scoring", "Payments Integration", "Team Collaboration", "API Access"],
    done: false,
  },
  {
    phase: "Q4 2026",
    title: "Enterprise",
    items: ["SSO & Compliance", "Custom Workflows", "White-label Options", "Global Expansion"],
    done: false,
  },
];

const RoadmapSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Roadmap</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            What's <span className="gradient-text">Next</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our journey to reinvent hiring.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-6 ${phase.done ? "border-primary/30" : ""}`}
            >
              <span className="text-xs font-medium text-primary">{phase.phase}</span>
              <h3 className="font-heading font-semibold text-lg mt-1 mb-4 text-foreground">{phase.title}</h3>
              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {phase.done ? (
                      <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-muted-foreground/40 flex-shrink-0" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
