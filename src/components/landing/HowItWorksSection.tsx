import { motion } from "framer-motion";
import { FileText, Code2, Award, Handshake } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Founder Posts Challenge",
    description: "Define a real business problem with constraints, deadlines, and evaluation criteria.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Talent Executes",
    description: "Builders submit working solutions — code, growth hacks, designs, strategies.",
  },
  {
    icon: Award,
    step: "03",
    title: "Work Gets Scored",
    description: "Submissions are evaluated on quality, creativity, and execution. XP is awarded.",
  },
  {
    icon: Handshake,
    step: "04",
    title: "Best Talent Gets Hired",
    description: "Founders hire based on proof of ability. No interviews needed.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Process</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From challenge to hire in four simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative"
            >
              <div className="glass p-6 h-full">
                <span className="text-5xl font-heading font-bold text-primary/10 absolute top-4 right-4">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
