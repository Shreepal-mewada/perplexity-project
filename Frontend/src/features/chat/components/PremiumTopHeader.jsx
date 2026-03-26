import React from "react";

const PremiumTopHeader = ({ onToggleSidebar, isCollapsed }) => {
  return (
    <header
      className={`fixed top-0 right-0 h-14 flex justify-between items-center px-4 md:px-8 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 w-full md:w-[calc(100%-15rem)]`}
      id="top-header"
    >
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          className="p-2 -ml-2 text-white/80 hover:text-white/80 hover:bg-white/5 rounded-lg transition-all flex items-center justify-center"
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined w-7 h-7" id="toggle-icon">
            {isCollapsed ? "menu" : "menu_open"}
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-white/80 hover:border-primary/40 transition-all group">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            ChatGPT v4.0
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-white/80 hover:text-white/80 transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/30 transition-all">
          <span className="text-xs font-medium px-1 text-white/80 hidden sm:inline">
            Pro Account
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHeURgNzrAlpYf6yEMCYvU3xB7id8m3IvalIqATBtT_-FNHfT_n1VxG8PwqaXWq9wRO3bnrUO3RAwoJVvS0SrzfnNwayh04LtU8krzX_9JXznIREl1w3z27KRANttBt5GEJ4Omi0taEyTl_bH6KPymnHZGLLDO3Sr7B641Us856uQGwd0R-pzA7cP1GkayESCBbQVz7IuJ610qSA6Nv-dKhPYw6QSlDqPGiAPLhgqkAVdDnO7tp3D_7xe3iKwxWnBI72e49LMIKYY"
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default PremiumTopHeader;
