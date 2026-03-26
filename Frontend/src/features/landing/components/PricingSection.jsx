import { motion } from "framer-motion";
import { Link } from "react-router";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for trying NexusAI",
    features: ["50 messages / day", "Standard response speed", "Basic chat history", "Community support"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    desc: "For power users and professionals",
    features: ["Unlimited messages", "Priority fast responses", "Advanced research mode", "Full chat history", "Source citations", "Priority support"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    desc: "For teams and organizations",
    features: ["Everything in Pro", "5 team members", "Shared workspaces", "Admin dashboard", "API access", "Dedicated support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-4"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Pricing</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient">
          Simple, Transparent Plans
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your workflow.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
              p.highlight
                ? "glass border-primary/40 glow-blue-sm relative"
                : "glass"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                Most Popular
              </span>
            )}
            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground">{p.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-display font-bold text-foreground">{p.price}</span>
              <span className="text-sm text-muted-foreground ml-1">{p.period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`w-full py-3 rounded-full text-sm font-medium text-center flex items-center justify-center gap-2 transition-all ${
                p.highlight
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border text-foreground hover:bg-surface"
              }`}
            >
              {p.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
