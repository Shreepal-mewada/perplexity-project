import React from "react";

const CollapsedRightPanel = ({ onToggleRightPanel = () => {} }) => {
  return (
    <aside className="hidden lg:flex h-screen flex-col items-center justify-start pt-4 gap-4 shrink-0 bg-black border-l border-white/5">
      {/* Show Insights Button */}
      <button
        onClick={onToggleRightPanel}
        className="p-3 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white/80 relative group"
        title="Show insights"
      >
        <span className="material-symbols-outlined">chevron_left</span>
        <div className="absolute right-full mr-2 px-2 py-1 bg-surface-container border border-white/10 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
          Insights
        </div>
      </button>
    </aside>
  );
};

export default CollapsedRightPanel;
