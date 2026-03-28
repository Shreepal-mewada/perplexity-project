import React from "react";

export function AppLoadingSkeleton() {
  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col md:flex-row overflow-hidden relative selection:bg-primary/30 text-foreground font-body">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full"></div>
      </div>

      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-60 h-full border-r border-border/40 bg-surface/10 shrink-0 p-4 transition-all z-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 animate-pulse"></div>
          <div className="h-5 w-28 rounded-md bg-surface/60 animate-pulse"></div>
        </div>

        {/* New Chat Button */}
        <div className="h-10 w-full rounded-full bg-primary/10 border border-primary/20 animate-pulse mb-8"></div>

        {/* Chat History Skeletons */}
        <div className="flex flex-col space-y-3">
          <div className="h-4 w-16 mb-2 rounded bg-surface/30 px-2"></div>
          <div className="h-9 w-full rounded-lg bg-surface/40 animate-pulse"></div>
          <div className="h-9 w-full rounded-lg bg-surface/30 animate-pulse"></div>
          <div className="h-9 w-3/4 rounded-lg bg-surface/30 animate-pulse"></div>
          <div className="h-9 w-full rounded-lg bg-surface/20 animate-pulse mt-4"></div>
          <div className="h-9 w-5/6 rounded-lg bg-surface/20 animate-pulse"></div>
        </div>
        
        {/* Bottom Profile Skeleton */}
        <div className="mt-auto flex items-center gap-3 p-2 border-t border-border/40 pt-4">
          <div className="h-10 w-10 rounded-full bg-surface/50 animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-1/2 rounded bg-surface/60 animate-pulse"></div>
            <div className="h-2 w-3/4 rounded bg-surface/40 animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-h-0 w-full relative z-10">
        
        {/* Mobile Header Skeleton */}
        <header className="md:hidden h-14 flex items-center px-4 shrink-0 border-b border-border/20 bg-background/80 backdrop-blur-md">
          <div className="h-8 w-8 rounded-lg bg-surface/50 animate-pulse"></div>
          <div className="mx-auto h-5 w-24 rounded-md bg-surface/50 animate-pulse -ml-4"></div>
        </header>

        {/* Chat Messages Feed Skeleton */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 space-y-8 mt-4">
          
          {/* AI Message */}
          <div className="flex flex-col gap-3 w-full max-w-3xl mx-auto">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse flex-shrink-0"></div>
               <div className="h-4 w-24 rounded bg-surface/50 animate-pulse"></div>
             </div>
             <div className="ml-11 h-20 w-3/4 md:w-2/3 rounded-2xl rounded-tl-sm bg-surface/30 animate-pulse"></div>
          </div>

          {/* User Message */}
          <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto items-end mt-4">
            <div className="h-4 w-12 rounded bg-surface/40 animate-pulse mr-2"></div>
            <div className="h-12 w-2/3 md:w-1/2 rounded-3xl rounded-tr-sm bg-primary/10 border border-primary/5 animate-pulse"></div>
          </div>

          {/* AI Thinking Message */}
          <div className="flex flex-col gap-3 w-full max-w-3xl mx-auto mt-4">
             <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse flex-shrink-0"></div>
               <div className="h-4 w-32 rounded bg-surface/50 animate-pulse"></div>
             </div>
             <div className="ml-11 h-32 w-full md:w-5/6 rounded-2xl rounded-tl-sm bg-surface/20 animate-pulse"></div>
          </div>
          
        </div>

        {/* Bottom Input Field Skeleton */}
        <div className="shrink-0 p-4 md:p-6 mb-2 md:mb-6">
          <div className="max-w-3xl mx-auto h-14 rounded-3xl bg-surface/30 border border-border/40 animate-pulse flex items-center px-4 justify-between">
             <div className="h-4 w-1/3 md:w-1/4 rounded bg-surface/40"></div>
             <div className="h-8 w-8 rounded-full bg-primary/20"></div>
          </div>
          <div className="max-w-3xl mx-auto mt-3 flex justify-center">
            <div className="h-2 w-48 rounded bg-surface/30 animate-pulse"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AppLoadingSkeleton;
