import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import MagicRings from "../components/MagicRings";
import DecryptedText from "../components/DecryptedText";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import { ArrowRight } from "lucide-react";
// import ButtonWithIcon from "@/components/ui/button-with-icon";
// import { ArrowRight } from "lucide-react";

import TrustedStrip from "../components/TrustedStrip";
import FeaturesSection from "../components/FeaturesSection";
import WhyChooseSection from "../components/WhyChooseSection";
import PricingSection from "../components/PricingSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FAQSection from "../components/FAQSection";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
    <div className="min-h-[100dvh] w-full bg-background text-foreground font-body selection:bg-primary/30 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full"></div>
      </div>

      {/* Replaced old Navbar with the cloned Navbar */}
      <Navbar />

      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-auto z-0 mt-[10%] md:mt-0">
            <MagicRings
              color="#BC4C23"
              colorTwo="#ffffff"
              ringCount={7}
              speed={1}
              attenuation={10}
              lineThickness={2}
              baseRadius={0.55}
              radiusStep={0.1}
              scaleRate={0.1}
              opacity={1}
              blur={0}
              noiseAmount={0.1}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={true}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={false}
            />
          </div>

          {/* Dark Overlays for Readability & Blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background/90 z-0 pointer-events-none"></div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20 mt-8 md:mt-16 flex flex-col items-center justify-center text-center">
            <div
              className="max-w-4xl flex flex-col items-center w-full"
              style={{ animation: "fadeSlideUp 1s ease-out forwards" }}
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 shadow-lg">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse-glow"></span>
                Introducing WebCore AI 4.0
              </div>

              <h2 className="text-gray-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6 drop-shadow-lg animate-fade-in-up">
                <DecryptedText
                  text="Built for"
                  animateOn="view"
                  speed={70}
                  maxIterations={10}
                />{" "}
                <br className="hidden md:block" />
                <span className="text-gradient">
                  <DecryptedText
                    text="Curious Minds"
                    animateOn="view"
                    speed={70}
                    maxIterations={20}
                    revealDirection="center"
                  />
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-xl sm:max-w-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed sm:leading-relaxed font-medium drop-shadow-md px-2">
                <DecryptedText
                  text="Ask anything, explore deeper, and get accurate, structured answers powered by advanced AI."
                  animateOn="view"
                  speed={100}
                  maxIterations={12}
                  revealDirection="start"
                />
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full mt-4 sm:mt-6">
                <ButtonWithIcon
                  asChild
                  className="w-2/3 sm:w-auto bg-primary text-primary-foreground shadow-xl glow-blue-sm h-12 sm:h-11 px-6"
                >
                  <Link
                    to="/register"
                    className="flex items-center justify-center text-sm sm:text-base "
                  >
                    Get Started for Free
                  </Link>
                </ButtonWithIcon>

                <Link
                  to="/loginf"
                  className="w-2/3 sm:w-auto bg-[#0F1013] hover:bg-surface text-white px-6 sm:px-8 h-12 sm:h-11 rounded-full flex items-center justify-center transition-colors font-medium border border-border text-sm sm:text-base"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeSlideUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </section>

        {/* Embedded the rest of the UI from ai-insight-hub */}
        <TrustedStrip />

        {/* Built strict layout boundaries for ScrollStack and next sections */}
        <div className="w-full relative py-12 md:py-24 mb-16 md:mb-32">
          {/* We pass a conditionally smaller itemDistance strictly for mobile cards using window innerWidth check if desired, but padding fixes 99% of it */}
          <ScrollStack
            useWindowScroll={true}
            itemDistance={
              typeof window !== "undefined" && window.innerWidth < 768
                ? 40
                : 100
            }
          >
            <ScrollStackItem itemClassName="glass-strong bg-background p-0 overflow-hidden">
              <FeaturesSection />
            </ScrollStackItem>
            <ScrollStackItem itemClassName="glass-strong bg-background p-0 overflow-hidden">
              <WhyChooseSection />
            </ScrollStackItem>
            <ScrollStackItem itemClassName="glass-strong bg-background p-0 overflow-hidden">
              <PricingSection />
            </ScrollStackItem>
          </ScrollStack>
        </div>

        <div className="relative z-10">
          <HowItWorksSection />
        </div>
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Cloned Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
