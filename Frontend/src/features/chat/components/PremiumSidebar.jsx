import React from "react";

const PremiumSidebar = ({
  onNewChat,
  chats = [],
  activeChat,
  onSelectChat,
  isCollapsed = false,
  onToggleSidebar,
}) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`h-screen fixed left-0 top-0 bg-background flex flex-col py-6 px-4 z-50 border-r border-border transition-all duration-300 ${
          isCollapsed ? "w-[4.5rem]" : "w-[15rem]"
        } md:relative`}
        id="sidebar"
      >
        {/* Brand Header */}
        <div className="mb-10 flex items-center gap-3 px-1 ">
          <div className="w-10 h-10 min-w-[2.5rem] rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="material-symbols-outlined text-on-primary font-bold">
              biotech
            </span>
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-xl font-bold tracking-tighter text-foreground font-display">
                WebCore AI
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Premium Assistant
              </p>
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <button className="w-full mb-8 py-3 px-3 flex items-center justify-center lg:justify-start gap-3 glass premium-shadow rounded-xl hover:border-glass-border/80 transition-all active:scale-95 group overflow-hidden">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform shrink-0 glow-blue-sm">
            add_circle
          </span>
          {!isCollapsed && (
            <span className="font-semibold text-sm text-foreground truncate">
              New Chat
            </span>
          )}
        </button>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {/* Main Features Section */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Main Features
              </p>
            )}
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-primary bg-surface rounded-sm font-semibold transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">chat</span>
                {!isCollapsed && <span className="text-sm truncate">Chat</span>}
              </a>
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  archive
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">Archived</span>
                )}
              </a>
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  auto_stories
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">Library</span>
                )}
              </a>
            </div>
          </div>

          {/* Workspaces Section */}
          <div>
            {!isCollapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Workspaces
              </p>
            )}
            <div className="space-y-1">
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  add_circle
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">New Project</span>
                )}
              </a>
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  image
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">Image</span>
                )}
              </a>
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  present_to_all
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">Presentation</span>
                )}
              </a>
              <a
                href="#"
                className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined shrink-0">
                  biotech
                </span>
                {!isCollapsed && (
                  <span className="text-sm truncate">Riset</span>
                )}
              </a>
            </div>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 space-y-4">
          {!isCollapsed && (
            <div className="p-4 rounded-2xl glass relative overflow-hidden group premium-shadow">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <p className="text-xs font-semibold mb-2 text-foreground">
                Upgrade to premium
              </p>
              <p className="text-[10px] text-muted-foreground mb-3">
                Unlock v4.0 & unlimited tokens.
              </p>
              <button className="w-full py-2 text-[11px] font-bold bg-secondary text-secondary-foreground rounded-lg hover:brightness-110 transition-all">
                Learn More
              </button>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <a
              href="#"
              className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-lg shrink-0">
                settings
              </span>
              {!isCollapsed && (
                <span className="text-xs truncate">Settings</span>
              )}
            </a>
            <a
              href="#"
              className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-lg shrink-0">
                help
              </span>
              {!isCollapsed && (
                <span className="text-xs truncate">Support</span>
              )}
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PremiumSidebar;
