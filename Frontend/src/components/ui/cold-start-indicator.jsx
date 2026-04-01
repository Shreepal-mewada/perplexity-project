import React from "react";

export function ColdStartIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-sm shadow-2xl">
      <div className="relative w-4 h-4">
        <div className="absolute inset-0 rounded-full border-2 border-white/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <span className="font-medium">Server is waking up...</span>
    </div>
  );
}
