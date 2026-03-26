import { motion } from "framer-motion";
import { Search, Cpu, FileText, MessagesSquare } from "lucide-react";

const steps = [
  { icon: Search, step: "01", title: "Ask", desc: "Type your question in natural language — anything from research to quick answers." },
  { icon: Cpu, step: "02", title: "Analyze", desc: "NexusAI processes your query, searches multiple sources, and reasons through the answer." },
  { icon: FileText, step: "03", title: "Generate", desc: "Receive a comprehensive, source-cited response with structured information." },
  { icon: MessagesSquare, step: "04", title: "Continue", desc: "Follow up, refine, or explore deeper — the conversation builds on context." },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 space-y-4"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">How It Works</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient">
          Four Simple Steps
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 text-center group hover:bg-surface-hover/40 transition-all"
          >
            <span className="text-xs font-display font-semibold text-primary/50 tracking-widest">{s.step}</span>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto my-4 group-hover:bg-primary/20 transition-colors">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
