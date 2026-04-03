import { motion } from "framer-motion";
import { Circle, CheckCircle2, Milestone, Rocket, Layers, ShieldCheck, Zap, BarChart3, Globe, Code } from "lucide-react";
import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Foundation",
    date: "Q1 2026",
    content: "Building the core engine for challenge management and user authentication. Establishing the base scoring architecture.",
    category: "Phase 1",
    icon: Layers,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Challenge Engine",
    date: "Q1 2026",
    content: "Real-time verification of coding challenges and project submissions.",
    category: "Foundation",
    icon: Code,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Growth & Rep",
    date: "Q2 2026",
    content: "Launching the reputation system and talent proof graphs. Connecting founders with top talent.",
    category: "Phase 2",
    icon: Milestone,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 4,
    title: "Leaderboards",
    date: "Q2 2026",
    content: "Dynamic competitive rankings based on verified skill proof and contribution history.",
    category: "Growth",
    icon: BarChart3,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 60,
  },
  {
    id: 5,
    title: "AI Analysis",
    date: "Q3 2026",
    content: "Automated analysis of submission quality using advanced AI models for deeper insights.",
    category: "Scale",
    icon: Zap,
    relatedIds: [4, 6],
    status: "pending",
    energy: 40,
  },
  {
    id: 6,
    title: "Scale Phase",
    date: "Q3 2026",
    content: "Enterprise integrations, payments, and global marketplace expansion.",
    category: "Phase 3",
    icon: Rocket,
    relatedIds: [5, 7],
    status: "pending",
    energy: 30,
  },
  {
    id: 7,
    title: "Global Reach",
    date: "Q4 2026",
    content: "Reaching millions of builders across the globe with decentralized skill verification.",
    category: "Phase 4",
    icon: Globe,
    relatedIds: [6],
    status: "pending",
    energy: 20,
  },
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="section-padding overflow-hidden relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-bold px-3 py-1 glass-subtle rounded-full">Roadmap & Vision</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-4 mb-4">
            Our <span className="gradient-text">Evolution</span> Path
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From foundation to global scale — follow our journey and shared mission.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Timeline Playcard */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            className="relative glass p-6 md:p-10 rounded-[2rem] overflow-hidden border-primary/10 flex flex-col justify-center min-h-[500px]"
          >
            <div className="absolute top-8 left-8 z-10">
              <h3 className="font-heading font-bold text-2xl text-foreground">Future Roadmap</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Circular Progression</p>
            </div>
            <RadialOrbitalTimeline timelineData={timelineData} className="bg-transparent h-[450px] md:h-[550px]" />
          </motion.div>

          {/* Vision/Mission Playcard */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            className="relative glass p-10 md:p-14 rounded-[2rem] border-primary/10 flex flex-col justify-center space-y-8"
          >
             <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Milestone className="text-primary" size={24} />
                </div>
                <h3 className="font-heading font-bold text-3xl text-foreground">The Soho Spirit</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are building a world where ability is the only currency that matters. 
                  Our mission is to eliminate bias and friction from elite technical hiring.
                </p>
             </div>

             <div className="space-y-6">
                {[
                  { title: "Meritocracy First", desc: "Your code and execution speak louder than a degree or a logo." },
                  { title: "Radical Transparency", desc: "Real-time feedback loops for both founders and builders." },
                  { title: "Proof over Promises", desc: "Verified work history built on actual delivered challenges." },
                  { title: "Global Opportunity", desc: "The best talent in the world found by the best teams in the world." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
