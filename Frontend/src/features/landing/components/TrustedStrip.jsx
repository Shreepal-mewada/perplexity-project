import { motion } from "framer-motion";

const partners = ["Morphic", "Nesa", "Ora", "DeepCore", "Sentient", "Vertex"];

const TrustedStrip = () => (
  <section className="pt-10 relative py-14 border-y border-border/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10"
      >
        Trusted by leading AI platforms
      </motion.p>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {partners.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-lg font-display font-semibold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedStrip;
