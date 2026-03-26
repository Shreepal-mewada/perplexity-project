import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-[#212121] text-white/80 font-body selection:bg-primary/30 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full"></div>
      </div>

      {/* Sticky Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#212121]/80 backdrop-blur-xl border-b border-white/5 h-16" : "bg-transparent h-20"
        } px-6 md:px-12 flex flex-col justify-center`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-sm font-bold">
                biotech
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight font-headline text-white/90">
              Zyricon AI
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</a>
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-sm font-semibold hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold bg-white text-black rounded-lg hover:bg-neutral-200 transition-transform active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/login" className="text-xs font-semibold hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 text-xs font-bold bg-white text-black rounded-lg hover:bg-neutral-200 transition-transform active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Introducing Zyricon AI 4.0
          </div>
          <h2 className="text-5xl md:text-7xl font-bold font-headline text-white tracking-tight leading-tight mb-8">
            Supercharge your mind <br className="hidden md:block" />
            with <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">AI-powered knowledge.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Zyricon AI is your intelligent research assistant. Get instant, deeply contextual answers perfectly formatted with markdown, code snippets, and structured tables.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-neutral-200 transition-transform active:scale-95 shadow-xl shadow-white/5"
            >
              Get Started for Free
            </Link>
            <Link
              to="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-transform active:scale-95"
            >
              Explore Features
            </Link>
          </div>
          
          {/* Hero App Mockup */}
          <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/50 p-2 md:p-4 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#212121] z-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs text-white/40 font-mono">zyricon-chat.app</div>
            </div>
            <div className="p-4 md:p-8 flex flex-col gap-6 opacity-70 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary/20 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/10"></div>
                  <div className="h-4 w-1/2 rounded bg-white/10"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-full rounded bg-white/20"></div>
                  <div className="h-4 w-[90%] rounded bg-white/20"></div>
                  <div className="h-24 w-full rounded-xl bg-black/40 border border-white/5 mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
              Designed for peak productivity
            </h3>
            <p className="text-white/60 max-w-xl mx-auto">
              Everything you need to write, research, and code faster than ever before seamlessly packaged into a stunning premium interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <span className="material-symbols-outlined text-4xl text-primary mb-6">bolt</span>
              <h4 className="text-xl font-bold text-white mb-3">Lightning Fast</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Experience instantaneous response generation powered by our optimized streaming infrastructure. No more waiting.
              </p>
            </GlassCard>
            <GlassCard>
              <span className="material-symbols-outlined text-4xl text-secondary mb-6">code_blocks</span>
              <h4 className="text-xl font-bold text-white mb-3">Developer Ready</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Native syntax highlighting, perfect markdown rendering, and code block formatting designed specifically for engineers.
              </p>
            </GlassCard>
            <GlassCard>
              <span className="material-symbols-outlined text-4xl text-emerald-400 mb-6">shield_lock</span>
              <h4 className="text-xl font-bold text-white mb-3">Private & Secure</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Your conversations are encrypted and private. We never use your professional data to train overarching public models.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Multi-Device Support */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold font-headline text-white leading-tight">
                Flawless context <br />
                <span className="text-white/50">on every device.</span>
              </h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Start a research thread on your desktop. Continue perfectly on your phone. Zyricon's meticulously crafted responsive architecture ensures you never lose a train of thought, no matter where you are working from.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <span className="material-symbols-outlined text-primary">check_circle</span> Responsive Mobile PWA
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <span className="material-symbols-outlined text-primary">check_circle</span> Seamless session sync
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-white/80">
                  <span className="material-symbols-outlined text-primary">check_circle</span> Global Chat History
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full aspect-square md:aspect-[4/3] bg-gradient-to-tr from-white/5 to-white/10 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center p-8 backdrop-blur-md">
              <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full"></div>
              {/* Abstract Multi Device Wireframes */}
              <div className="w-full max-w-[300px] aspect-[9/16] bg-black/80 border border-white/10 rounded-[2rem] shadow-2xl p-2 absolute right-[10%] bottom-[-10%] z-20">
                <div className="w-full h-full border border-white/5 rounded-[1.5rem] bg-[#212121]  flex flex-col">
                  <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2 shrink-0"></div>
                  <div className="flex-1 p-4 space-y-3 mt-4">
                    <div className="w-3/4 h-8 bg-white/5 rounded-2xl ml-auto rounded-tr-sm"></div>
                    <div className="w-5/6 h-12 bg-primary/10 rounded-2xl rounded-tl-sm border border-primary/20"></div>
                  </div>
                </div>
              </div>
              <div className="w-[120%] aspect-[16/10] bg-black/80 border border-white/10 rounded-2xl shadow-2xl p-2 z-10 -ml-10 -mt-10">
                <div className="w-full h-full border border-white/5 rounded-xl bg-[#212121]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-12 py-24 border-t border-white/5">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-headline text-white mb-4">
              Simple, transparent pricing
            </h3>
            <p className="text-white/60 max-w-xl mx-auto">
              Start chatting instantly for free, or unlock the absolute apex of performance with Zyricon Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GlassCard className="relative overflow-hidden group">
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">Basic</h4>
                <p className="text-sm text-white/50">Perfect to explore the power of AI</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-white/50 font-medium">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-white/40 text-sm">done</span> Access to Zyricon 3.0 model
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-white/40 text-sm">done</span> Standard response speed
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-white/40 text-sm">done</span> 50 queries per day limit
                </li>
                <li className="flex items-center gap-3 text-sm text-white/40">
                  <span className="material-symbols-outlined text-white/10 text-sm">close</span> Advanced Data Analysis
                </li>
              </ul>
              <Link
                to="/register"
                className="block text-center w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition text-white"
              >
                Sign Up Free
              </Link>
            </GlassCard>

            <GlassCard className="relative overflow-hidden border-primary/30 shadow-[0_0_40px_-15px_rgba(var(--color-primary),0.3)]">
              <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded-bl-xl z-10">
                Most Popular
              </div>
              <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none"></div>
              
              <div className="mb-8 relative z-10">
                <h4 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Pro <span className="material-symbols-outlined text-primary text-xl">verified</span>
                </h4>
                <p className="text-sm text-white/50">For heavy users and professionals</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1 relative z-10">
                <span className="text-5xl font-bold text-white">$20</span>
                <span className="text-white/50 font-medium">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-primary text-sm">done</span> Access to Zyricon 4.0 Omni
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-primary text-sm">done</span> Maximum response speeds
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-primary text-sm">done</span> Unlimited queries
                </li>
                <li className="flex items-center gap-3 text-sm text-white/80">
                  <span className="material-symbols-outlined text-primary text-sm">done</span> Advanced Code Analysis
                </li>
              </ul>
              <button
                className="block text-center w-full py-3 px-4 bg-white text-black rounded-xl font-bold text-sm transition hover:bg-neutral-200 active:scale-95 relative z-10 shadow-lg shadow-white/5"
              >
                Upgrade to Pro
              </button>
            </GlassCard>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-24">
          <div className="bg-linear-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            <h3 className="text-3xl md:text-5xl font-bold font-headline text-white mb-6 relative z-10">
              Ready to accelerate your workflow?
            </h3>
            <p className="text-white/60 mb-10 max-w-xl mx-auto relative z-10">
              Join thousands of developers, researchers, and creators already scaling their minds using Zyricon AI.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black text-sm font-bold rounded-xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-primary/20 relative z-10"
            >
              Launch Dashboard
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#1a1a1a] py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-linear-to-br from-primary to-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[10px] font-bold">biotech</span>
              </div>
              <span className="font-headline font-bold text-white text-sm">Zyricon AI</span>
            </div>
            <p className="text-xs text-white/40">
              Building the future of conversational intelligence and professional workflows.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white text-sm mb-4">Product</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white text-sm mb-4">Resources</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white text-sm mb-4">Legal</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#646464] text-[10px]">
            &copy; 2026 Zyricon Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white transition"><span className="material-symbols-outlined text-sm">language</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
