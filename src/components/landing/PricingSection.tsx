import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const plans = [
  {
    name: "Builder",
    price: "Free",
    description: "For talent ready to prove their skills",
    features: [
      "Unlimited challenge entries",
      "Public proof profile",
      "XP & leaderboard access",
      "Community access",
    ],
    cta: "Start Building",
    highlight: false,
  },
  {
    name: "Founder",
    price: "$29",
    period: "/mo",
    description: "For startups hiring through proof",
    features: [
      "Post unlimited challenges",
      "Advanced scoring tools",
      "Talent search & filters",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Hiring",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For orgs at scale",
    features: [
      "Everything in Founder",
      "Custom challenge templates",
      "API access",
      "Dedicated account manager",
      "SSO & compliance",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const PricingSection = () => {
  const { user } = useAuth();
  return (
    <section id="pricing" className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-widest text-primary font-medium">Pricing</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Scale as you grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-8 flex flex-col ${
                plan.highlight ? "border-primary/40 glow-primary relative" : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading font-semibold text-xl text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-heading font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  const url = `https://checkout.dodopayments.com/buy/pdt_0Nd1KSKvsSdQ6ty1ZO4w0?quantity=1&external_customer_id=${user?.uid || ""}&redirect_url=${window.location.origin}/dashboard`;
                  window.location.href = url;
                }}
                className={
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full"
                }
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
