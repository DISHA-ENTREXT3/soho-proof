import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Soho Space completely changed how we hire. We found our lead engineer through a single challenge.",
    name: "Sarah Chen",
    role: "CEO, Launchpad AI",
  },
  {
    quote: "I landed my dream role without a single interview. My work spoke for itself.",
    name: "Marcus Webb",
    role: "Growth Lead, Nextera",
  },
  {
    quote: "The gamified reputation system keeps me motivated. It's LinkedIn meets competitive coding.",
    name: "Priya Sharma",
    role: "Full-Stack Developer",
  },
  {
    quote: "We saved 3 months of hiring time. The quality of submissions blew us away.",
    name: "Jake Morrison",
    role: "CTO, Finley",
  },
];

const doubled = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Loved by <span className="gradient-text">Builders</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll-left">
          {doubled.map((t, i) => (
            <div
              key={i}
              className="glass p-6 min-w-[320px] max-w-[320px] mx-3 flex-shrink-0"
            >
              <p className="text-sm text-foreground/90 mb-4 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
