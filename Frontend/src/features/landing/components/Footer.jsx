import { Sparkles } from "lucide-react";
import { Link } from "react-router";

const Footer = () => (
  <footer id="about" className="border-t border-border/40 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold text-foreground">NexusAI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The intelligent AI answer engine built for the next generation of search and research.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-display font-semibold text-foreground text-sm">Product</h4>
          <div className="space-y-2.5">
            {["Features", "Pricing", "API", "Changelog"].map((l) => (
              <a key={l} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display font-semibold text-foreground text-sm">Company</h4>
          <div className="space-y-2.5">
            {["About", "Blog", "Careers", "Contact"].map((l) => (
              <a key={l} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-display font-semibold text-foreground text-sm">Legal</h4>
          <div className="space-y-2.5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 NexusAI. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {["Twitter", "GitHub", "Discord"].map((s) => (
            <a key={s} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
