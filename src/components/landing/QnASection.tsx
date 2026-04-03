import { motion } from "framer-motion";
import { HelpCircle, Star, Target, CheckCircle2 } from "lucide-react";

const qnaData = [
  {
    title: "What is Soho Space?",
    icon: HelpCircle,
    points: [
      "A proof-of-execution hiring platform for elite startups.",
      "A meritocratic ecosystem where work speaks louder than resumes.",
      "A bridge between visionary founders and world-class builders."
    ]
  },
  {
    title: "Why to use it?",
    icon: Star,
    points: [
      "Hire with 100% certainty by seeing actual task execution.",
      "Build a verified professional reputation and high-end skill graph.",
      "Skip long interview cycles and move straight to proof of ability."
    ]
  },
  {
    title: "How to use it?",
    icon: Target,
    points: [
      "Founders post real business problems as tracked challenges.",
      "Builders submit high-fidelity solutions and earn XP/Rewards.",
      "High-performers get hired directly based on submission quality."
    ]
  }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const QnASection = () => {
  return (
    <section className="section-padding relative overflow-hidden bg-transparent">
      <div className="container mx-auto relative z-10">
        <motion.div
           variants={container}
           initial="hidden"
           whileInView="show"
           viewport={{ once: false, amount: 0.1 }}
           className="grid md:grid-cols-3 gap-8"
        >
          {qnaData.map((qna) => (
            <motion.div
              key={qna.title}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="group glass p-8 border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <qna.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                  {qna.title}
                </h3>
              </div>
              
              <ul className="space-y-4">
                {qna.points.map((point, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-start gap-3 group/point"
                  >
                    <CheckCircle2 size={18} className="text-primary/40 mt-0.5 shrink-0 group-hover/point:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground leading-relaxed group-hover/point:text-foreground/90 transition-colors">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default QnASection;
