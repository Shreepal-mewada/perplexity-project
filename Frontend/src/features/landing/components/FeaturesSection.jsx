import { motion } from "framer-motion";
import { Zap, BookOpen, Brain, Clock, Shield, Smartphone, LayoutDashboard, MessageSquare } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast Answers", desc: "Get precise responses in milliseconds, powered by advanced AI models." },
  { icon: BookOpen, title: "Source-Backed Responses", desc: "Every answer cites real sources so you can verify and explore further." },
  { icon: Brain, title: "Context Awareness", desc: "Understands conversation history and builds on previous context." },
  { icon: Clock, title: "Chat History", desc: "Access your entire conversation archive, organized and searchable." },
  { icon: Shield, title: "Private & Secure", desc: "End-to-end encrypted conversations that stay completely private." },
  { icon: Smartphone, title: "Multi-Device Sync", desc: "Seamless experience across desktop, tablet, and mobile." },
  { icon: LayoutDashboard, title: "Pro Dashboard", desc: "Professional workspace with analytics and conversation management." },
  { icon: MessageSquare, title: "Real-Time Chat", desc: "Fluid, natural conversation with streaming responses." },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-4"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Capabilities</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient">
          Built for the Future of Search
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need for intelligent AI-powered research and conversation.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-6 hover:bg-surface-hover/40 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
