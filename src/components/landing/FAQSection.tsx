import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is proof-of-execution hiring?",
    a: "Instead of evaluating candidates through resumes and interviews, founders post real challenges. Talent submits working solutions, and hiring decisions are based on actual demonstrated ability.",
  },
  {
    q: "How does the challenge system work?",
    a: "Founders create challenges with specific requirements, deadlines, and evaluation criteria. Talent competes by submitting real work — code, strategies, designs, or growth experiments.",
  },
  {
    q: "Is Soho Space free for talent?",
    a: "Yes! Builders can join, complete challenges, and build their proof profile entirely for free. Premium features are available for founders who want to post challenges and hire.",
  },
  {
    q: "How is work scored and evaluated?",
    a: "Each challenge has custom scoring criteria set by the founder. Our platform supports manual review, peer evaluation, and extensible automated scoring for technical submissions.",
  },
  {
    q: "What types of challenges are available?",
    a: "Challenges span growth marketing, software engineering, product design, data analysis, and more. Both tech and non-tech roles are supported.",
  },
  {
    q: "How does the reputation system work?",
    a: "Every completed challenge earns XP based on your score. XP accumulates into a visible reputation score with leaderboard rankings and skill-specific proof graphs.",
  },
  {
    q: "Can I use Soho Space for team hiring?",
    a: "Absolutely. Our Founder and Enterprise plans support team collaboration, allowing multiple stakeholders to review submissions and make hiring decisions together.",
  },
  {
    q: "How is Soho Space different from freelancing platforms?",
    a: "Soho Space is designed for full-time hiring, not gig work. Challenges simulate real job tasks, and the goal is a permanent hire — not a one-off project.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">FAQ</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass border-glass-border px-6">
                <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
