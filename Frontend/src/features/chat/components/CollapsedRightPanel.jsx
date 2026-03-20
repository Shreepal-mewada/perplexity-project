import React from "react";
import { ChevronLeft } from "lucide-react";

const CollapsedRightPanel = ({ onToggleRightPanel = () => {} }) => {
  return (
    <aside className="hidden lg:flex h-screen flex-col items-center justify-start pt-4 gap-4 shrink-0">
      {/* Show Insights Button */}
      <button
        onClick={onToggleRightPanel}
        className="p-3 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white relative group"
        title="Show insights"
      >
        <ChevronLeft size={20} />
        <div className="absolute right-full mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          Insights
        </div>
      </button>
    </aside>
  );
};

export default CollapsedRightPanel;
