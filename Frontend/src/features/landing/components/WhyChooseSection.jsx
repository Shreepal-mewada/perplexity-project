import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reasons = [
  "Cleaner, distraction-free interface",
  "Faster response times with streaming",
  "Context-aware multi-turn conversations",
  "Source-cited answers for verification",
  "Premium UI designed for professionals",
  "Built for students, researchers & teams",
  "Secure and private by default",
  "Organized chat history & dashboard",
];

const WhyChooseSection = () => (
  <section className="section-padding relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Why NexusAI</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient">
            Beyond Basic AI Chatbots
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Most AI tools give you generic answers. NexusAI delivers research-grade intelligence with a premium experience that professionals actually want to use.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {reasons.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-4 glass rounded-xl"
            >
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-foreground/85">{r}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
