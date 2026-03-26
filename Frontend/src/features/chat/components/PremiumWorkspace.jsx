import React from "react";
import PremiumFeatureCard from "./PremiumFeatureCard";

const PremiumWorkspace = ({ onSendMessage }) => {
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Centered Workspace */}
      <section className="flex-1 pt-20 md:pt-32 pb-32 md:pb-40 px-4 md:px-12 max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center">
        {/* Atmospheric Orb Element */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-secondary/5 to-transparent opacity-50 blur-[40px] animate-pulse"></div>
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary via-secondary to-primary-container opacity-20 blur-xl"></div>
          <div className="absolute w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black border border-primary/40 flex items-center justify-center shadow-2xl shadow-primary/20">
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground mb-3 px-4 md:px-0">
          Ready to Create{" "}
          <span className="text-gradient">
            Something New?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mb-10 font-body leading-relaxed px-4 md:px-0">
          Experience the next generation of creative intelligence. From
          high-fidelity visual generation to complex strategic planning.
        </p>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button className="px-5 py-2.5 rounded-full glass border border-transparent text-sm font-medium hover:border-primary/50 transition-all flex items-center gap-2 text-foreground">
            <span className="material-symbols-outlined text-primary text-lg">
              image
            </span>
            Create Image
          </button>
          <button className="px-5 py-2.5 rounded-full glass border border-transparent text-sm font-medium hover:border-secondary/50 transition-all flex items-center gap-2 text-foreground">
            <span className="material-symbols-outlined text-secondary text-lg">
              lightbulb
            </span>
            Brainstorm
          </button>
          <button className="px-5 py-2.5 rounded-full glass border border-transparent text-sm font-medium hover:border-white/40 transition-all flex items-center gap-2 text-foreground">
            <span className="material-symbols-outlined text-muted-foreground text-lg">
              edit_note
            </span>
            Make a plan
          </button>
        </div>

        {/* Main Input Bar */}
        <div className="w-full max-w-3xl relative px-4 md:px-0">
          <div className="glass rounded-full p-2 md:pl-6 flex items-center gap-2 md:gap-3 premium-shadow ring-1 ring-glass-border">
            <input
              className="bg-transparent border-none focus:ring-0 flex-1 text-foreground text-base placeholder:text-muted-foreground font-medium"
              placeholder="Ask Anything..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex items-center gap-1 pr-2">
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Attach"
              >
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Settings"
              >
                <span className="material-symbols-outlined">
                  settings_suggest
                </span>
              </button>
              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Options"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
              <div className="h-6 w-[1px] bg-border mx-2"></div>
              <button
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                title="Voice"
              >
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 glow-blue-sm"
                onClick={handleSend}
              >
                <span className="material-symbols-outlined font-bold">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-4 flex justify-center gap-8">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Encrypted Session
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow"></span>
              Ultra-Fast Latency
            </span>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid Bottom Section */}
      <section className="px-12 pb-12 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumFeatureCard
            icon="filter_hdr"
            title="Image Generator"
            description="Create photorealistic landscapes and artistic concepts with our newest diffusion model."
            buttonText="Generate"
            buttonColor="primary"
          />
          <PremiumFeatureCard
            icon="auto_graph"
            title="AI Presentation"
            description="Turn your ideas into structured pitch decks and visual stories instantly with smart layouts."
            buttonText="Make"
            buttonColor="secondary"
          />
          <PremiumFeatureCard
            icon="terminal"
            title="Dev Assistant"
            description="Refactor code, debug complex systems, and generate documentation across 40+ languages."
            buttonText="Create"
            buttonColor="primary-container"
          />
        </div>
      </section>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full"></div>
      </div>
    </>
  );
};

export default PremiumWorkspace;
