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
          viewport={{ once: false, amount: 0.1 }}
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
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative h-full"
            >
              <div className="glass p-8 h-full relative overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-primary/10 border-border/50 hover:border-primary/40">
                {/* Theme Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <span className="text-5xl font-heading font-bold text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </span>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {step.description}
                  </p>
                  <div className="mt-6 w-8 h-1 bg-border group-hover:bg-primary group-hover:w-full transition-all duration-500" />
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border group-hover:hidden transition-all" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
