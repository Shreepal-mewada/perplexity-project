import React, { useEffect, useState } from "react";
import { useBackendHealth } from "../hooks/useBackendHealth";

const BackendStatusPopup = () => {
  const isBackendDown = useBackendHealth();
  const [isVisible, setIsVisible] = useState(false);
  const [dots, setDots] = useState("");

  // Animate loading dots
  useEffect(() => {
    if (!isBackendDown) {
      // Fade out
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(fadeOutTimer);
    }

    // Fade in
    setIsVisible(true);

    // Animate dots
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotInterval);
  }, [isBackendDown]);

  if (!isVisible && !isBackendDown) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          isBackendDown ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Popup */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md px-4 transition-all duration-300 ${
          isBackendDown
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="glass-strong bg-surface/90 border border-border/50 rounded-2xl p-6 shadow-2xl">
          {/* Loading Spinner */}
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Animated Icon */}
            <div className="relative w-16 h-16">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>

              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Server is waking up{dots}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Please wait a moment while we initialize the backend.
                <br />
                This usually takes 10-30 seconds.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="w-full pt-2">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-primary/60 rounded-full animate-pulse"></span>
                <span>Retrying every 5 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner (Alternative for mobile) */}
      <div
        className={`fixed top-0 left-0 right-0 z-[9997] bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-3 shadow-lg transition-all duration-300 md:hidden ${
          isBackendDown
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-sm">
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Server waking up{dots}</span>
        </div>
      </div>
    </>
  );
};

export default BackendStatusPopup;
