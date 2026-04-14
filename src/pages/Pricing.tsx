import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteGrid } from "@/components/ui/infinite-grid";
import { Link } from "react-router-dom";

const CONTACT = "mailto:business@entrext.in";

const founderPlans = [
  {
    name: "Starter Trial",
    price: "Free",
    period: "7-day trial",
    badge: null,
    features: [
      "Post 1 challenge",
      "Access to verified builders",
      "Basic submission review",
      "Standard evaluation criteria",
      "Email support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/auth",
    highlight: false,
    icon: Clock,
  },
  {
    name: "Founder Pro",
    price: "$59",
    period: "/month",
    badge: "Most Popular",
    features: [
      "Unlimited challenges",
      "Priority talent matching",
      "Custom evaluation criteria",
      "Dedicated account manager",
      "White-glove evaluation support",
      "Direct-to-Builder DM access",
      "Custom talent proof API",
    ],
    cta: "Get Started",
    ctaHref: CONTACT,
    highlight: true,
    icon: Crown,
  },
];

const builderPlans = [
  {
    name: "Explorer Trial",
    price: "Free",
    period: "7-day trial",
    badge: null,
    features: [
      "Browse all active challenges",
      "Submit up to 2 entries",
      "Public proof profile",
      "Standard XP gain",
      "Community access",
    ],
    cta: "Start Free Trial",
    ctaHref: "/auth",
    highlight: false,
    icon: Clock,
  },
  {
    name: "Builder Pro",
    price: "$29",
    period: "/month",
    badge: "Best Value",
    features: [
      "Unlimited challenge entries",
      "Early access to top-tier bounties",
      "Advanced skill graph",
      "Priority verified status badge",
      "Direct-to-Founder DM access",
      "Boosted profile visibility",
    ],
    cta: "Unlock Pro",
    ctaHref: CONTACT,
    highlight: true,
    icon: Zap,
  },
];

interface Plan {
  name: string;
  price: string;
  period: string;
  badge: string | null;
  features: string[];
  cta: string;
  ctaHref: string;
  highlight: boolean;
  icon: React.ElementType;
}

const PlanCard = ({ plan }: { plan: Plan }) => {
  const isExternal = plan.ctaHref.startsWith("mailto:");
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`glass p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden ${
        plan.highlight ? "border-primary/40 shadow-lg shadow-primary/10" : "border-border/50"
      }`}
    >
      {plan.badge && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {plan.badge}
        </div>
      )}
      <div>
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${plan.highlight ? "bg-primary/20" : "bg-secondary"}`}>
          <plan.icon size={20} className={plan.highlight ? "text-primary" : "text-muted-foreground"} />
        </div>
        <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-heading font-bold">{plan.price}</span>
          <span className="text-muted-foreground text-sm">{plan.period}</span>
        </div>
        <ul className="space-y-3 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm">
              <CheckCircle2 size={15} className={plan.highlight ? "text-primary" : "text-muted-foreground"} />
              {f}
            </li>
          ))}
        </ul>
      </div>
      {isExternal ? (
        <a href={plan.ctaHref}>
          <Button
            size="lg"
            className={`w-full ${plan.highlight ? "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
          >
            {plan.cta}
          </Button>
        </a>
      ) : (
        <Link to={plan.ctaHref}>
          <Button
            size="lg"
            className={`w-full ${plan.highlight ? "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
          >
            {plan.cta}
          </Button>
        </Link>
      )}
    </motion.div>
  );
};

const SectionHeader = ({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) => (
  <div className="flex items-center gap-3 mb-10 pb-4 border-b border-border">
    <div className={`p-2 rounded-xl ${color}`}>
      <Icon size={22} className="text-primary" />
    </div>
    <h2 className="font-heading text-3xl font-bold">{title}</h2>
  </div>
);

const Pricing = () => (
  <div className="relative min-h-screen bg-background overflow-x-hidden">
    <div className="fixed inset-0 z-0 opacity-100 pointer-events-none">
      <InfiniteGrid className="!bg-transparent" />
    </div>
    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start free, upgrade when you're ready. Built for founders who hire smart and builders who ship fast.
            </p>
          </div>

          {/* Founders */}
          <section className="mb-24">
            <SectionHeader icon={Shield} title="For Founders" color="bg-primary/10" />
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {founderPlans.map((p) => <PlanCard key={p.name} plan={p} />)}
            </div>
          </section>

          {/* Builders */}
          <section>
            <SectionHeader icon={Zap} title="For Builders" color="bg-primary/10" />
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {builderPlans.map((p) => <PlanCard key={p.name} plan={p} />)}
            </div>
          </section>

          {/* Footer note */}
          <div className="text-center mt-16">
            <p className="text-sm text-muted-foreground">
              Questions about pricing?{" "}
              <a href="mailto:business@entrext.in" className="text-primary hover:underline font-semibold">
                Contact us at business@entrext.in
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default Pricing;
