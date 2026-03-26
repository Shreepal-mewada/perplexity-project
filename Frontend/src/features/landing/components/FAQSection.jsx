import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is NexusAI?", a: "NexusAI is an AI-powered answer engine that delivers precise, source-backed responses to your questions. Think of it as an intelligent research assistant that helps you find accurate information faster." },
  { q: "How do I create an account?", a: "Click 'Get Started' or 'Register' to create your free account. You can sign up with email or connect your existing accounts. Setup takes less than 30 seconds." },
  { q: "What plans are available?", a: "We offer Free, Pro ($19/mo), and Team ($49/mo) plans. The Free plan includes 50 messages per day, while Pro and Team unlock unlimited messages, faster responses, and advanced features." },
  { q: "Is my data private and secure?", a: "Absolutely. All conversations are encrypted end-to-end. We never share, sell, or use your data for training. You can delete your history at any time." },
  { q: "What can I use NexusAI for?", a: "Research, learning, writing assistance, data analysis, coding help, brainstorming, fact-checking, and much more. NexusAI is built for students, professionals, and researchers." },
  { q: "Can I access NexusAI on mobile?", a: "Yes. NexusAI works seamlessly across desktop, tablet, and mobile browsers with full feature parity and real-time sync." },
];

const FAQSection = () => {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="section-padding relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-foreground text-sm">{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ml-4 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
