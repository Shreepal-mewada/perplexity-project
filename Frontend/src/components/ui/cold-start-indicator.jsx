import React from "react";

export function ColdStartIndicator() {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white shadow-2xl">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-3 border-white/20" />
        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-lg">Server is waking up...</span>
        <span className="text-white/50 text-sm">This may take up to 2 minutes</span>
      </div>
    </div>
  );
}
