import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => (
  <section className="section-padding relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient">
            Ready to Experience the Future?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of users who trust NexusAI for intelligent, source-backed answers every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2 glow-blue-sm"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full font-medium text-sm border border-border text-foreground hover:bg-surface transition-colors"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
