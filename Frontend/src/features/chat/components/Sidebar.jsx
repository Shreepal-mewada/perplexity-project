import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";

const Sidebar = ({
  chats = [],
  activeChat,
  onSelectChat,
  onNewChat,
  sidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onToggleSidebarDesktop = () => {},
  isCollapsed = false,
  onDeleteChat = () => {},
}) => {
  const { user } = useSelector((state) => state.auth) || {};
  const { handleLogout } = useAuth();

  const actualUser = user?.user || user;
  const username = actualUser?.username || actualUser?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  return (
    <>
      {/* Sidebar Overlay (Mobile only) with smooth fade opacity */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onToggleSidebar(false)}
      />

      {/* Unified Sidebar Container */}
      <aside
        className={`fixed md:relative left-0 top-0 z-40 h-[100dvh] shrink-0 border-r border-border/40 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-between
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }
          ${isCollapsed ? "w-20" : "w-80"}
        `}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Logo Section */}
          <div
            className={`flex items-center border-b border-border/30 shrink-0 transition-all duration-300 ${
              isCollapsed ? "p-4 justify-center" : "p-4 justify-between gap-3"
            }`}
          >
            <div
              className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
                isCollapsed ? "w-full justify-center" : "flex-1"
              }`}
            >
              <button
                onClick={onToggleSidebarDesktop}
                className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-primary/10 shrink-0 bg-primary/10 flex items-center justify-center group relative ring-1 ring-border hover:ring-primary/40 transition-all"
              >
                <img
                  src="/spider logo per.jpg"
                  alt="App Icon"
                  className="w-full h-full object-cover rounded-full"
                />
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover:translate-y-0">
                    Expand Sidebar
                  </div>
                )}
              </button>

              <div
                className={`flex flex-col min-w-0 transition-all duration-300 origin-left ${
                  isCollapsed
                    ? "opacity-0 w-0 scale-90"
                    : "opacity-100 w-auto scale-100"
                }`}
              >
                <h1 className="text-[17px] font-extrabold tracking-tight text-foreground font-display truncate">
                  WebCore AI
                </h1>
              </div>
            </div>

            {!isCollapsed && (
              <button
                onClick={onToggleSidebarDesktop}
                className="hidden md:flex p-1.5 hover:bg-surface/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground shrink-0"
                title="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-[20px]">
                  menu_open
                </span>
              </button>
            )}

            <button
              onClick={() => onToggleSidebar(false)}
              className="md:hidden flex p-1.5 hover:bg-surface/80 rounded-lg transition-colors text-foreground shrink-0"
              title="Close sidebar"
            >
              <span className="material-symbols-outlined shrink-0 text-[20px]">
                close
              </span>
            </button>
          </div>

          {/* New Chat Button */}
          <div
            className={`shrink-0 z-10 transition-all duration-300 ${
              isCollapsed ? "p-3 mt-2" : "p-4"
            }`}
          >
            <button
              onClick={onNewChat}
              className={`group relative flex items-center justify-center font-semibold text-primary-foreground rounded-xl overflow-hidden transition-all duration-300 active:scale-95 glow-blue-sm shadow-md ${
                isCollapsed ? "h-11 w-11 mx-auto" : "w-full py-3 px-4 gap-2.5"
              }`}
            >
              <div className="absolute inset-0 bg-primary opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 border border-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="material-symbols-outlined text-[22px] relative z-10 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                add
              </span>
              <span
                className={`relative z-10 font-display font-medium text-[14px] transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                New Chat
              </span>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover:translate-y-0">
                  New Chat
                </div>
              )}
            </button>
          </div>

          {/* Scrolling Main content area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-styled flex flex-col pt-1">
            {chats && chats.length > 0 && (
              <div
                className={`transition-all duration-300 ${
                  isCollapsed
                    ? "flex flex-col items-center gap-3 px-3"
                    : "px-4 pb-4"
                }`}
              >
                {isCollapsed ? (
                  <>
                    <button
                      onClick={onToggleSidebarDesktop}
                      className="w-11 h-11 flex items-center justify-center hover:bg-surface/60 rounded-xl transition-all text-muted-foreground hover:text-primary relative group shrink-0"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        search
                      </span>
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover:translate-y-0">
                        Search Chat
                      </div>
                    </button>
                    <button
                      onClick={onToggleSidebarDesktop}
                      className="w-11 h-11 flex items-center justify-center hover:bg-surface/60 rounded-xl transition-all text-muted-foreground hover:text-primary relative group shrink-0 mt-1"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        history
                      </span>
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover:translate-y-0">
                        Chat History
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Search Input */}
                    <div className="mb-5 relative group/search">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-muted-foreground/60 text-[18px] group-focus-within/search:text-primary transition-colors duration-300">
                          search
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-surface/40 hover:bg-surface/60 focus:bg-surface/80 border border-transparent focus:border-primary/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* History Label */}
                    <div className="flex items-center gap-2 px-1 pb-2 opacity-100 transition-opacity duration-300">
                      <span className="material-symbols-outlined text-muted-foreground/50 text-[16px]">
                        history
                      </span>
                      <p className="text-[11px] font-bold text-muted-foreground/60 tracking-wider">
                        REPORTS
                      </p>
                    </div>
                  </>
                )}

                {/* Chat List Skeletons/Items (Expanded) */}
                <div
                  className={`space-y-1 transition-all duration-300 origin-top flex flex-col w-full ${
                    isCollapsed
                      ? "scale-y-0 h-0 opacity-0 overflow-hidden"
                      : "scale-y-100 h-auto opacity-100"
                  }`}
                >
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        onSelectChat(chat);
                        onToggleSidebar(false);
                      }}
                      className={`group w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200 flex items-center justify-between gap-3 overflow-hidden ${
                        activeChat?.id === chat.id
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "border border-transparent hover:bg-surface/60 text-muted-foreground hover:text-foreground"
                      }`}
                      title={chat.title}
                    >
                      <div className="min-w-0 flex-1 transition-all">
                        <p
                          className={`truncate text-sm font-medium transition-colors ${
                            activeChat?.id === chat.id ? "text-foreground" : ""
                          }`}
                        >
                          {chat.title}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] truncate transition-colors ${
                            activeChat?.id === chat.id
                              ? "text-primary/70"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {chat.time}
                        </p>
                      </div>
                      <div
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/15 text-muted-foreground/40 hover:text-red-500 rounded-lg transition-all duration-200 shrink-0 -mr-1"
                        title="Delete chat"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Footer */}
        <div
          className={`border-t border-border/30 shrink-0 transition-all duration-300 bg-background ${
            isCollapsed
              ? "p-3 flex flex-col items-center gap-3 pb-5"
              : "p-4 pb-5"
          }`}
        >
          <div
            className={`flex rounded-2xl transition-all duration-300 relative group overflow-visible
             ${
               isCollapsed
                 ? "flex-col items-center gap-3 bg-transparent justify-center w-full"
                 : "items-center justify-between bg-surface/30 hover:bg-surface/50 border border-border/30 hover:border-border/60 p-2 pl-2.5"
             }
          `}
          >
            {/* Logout Button (when collapsed) */}
            {isCollapsed && (
              <button
                onClick={handleLogout}
                className="w-11 h-11 hover:bg-red-500/10 rounded-xl transition-all text-muted-foreground hover:text-red-500 relative group/btn flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover/btn:translate-y-0">
                  Logout
                </div>
              </button>
            )}

            {/* User Avatar & Info */}
            <button
              onClick={isCollapsed ? onToggleSidebarDesktop : undefined}
              className={`flex items-center gap-3 min-w-0 rounded-2xl transition-all ${
                isCollapsed
                  ? "w-11 h-11 relative group/user hover:bg-surface/60 justify-center"
                  : "flex-1"
              }`}
            >
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 text-white font-bold transition-all shadow-md ${
                  isCollapsed ? "h-9 w-9 text-sm" : "h-10 w-10 text-[15px]"
                }`}
              >
                {initial}
              </div>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-surface border border-border/50 text-foreground text-xs font-medium rounded-lg opacity-0 group-hover/user:opacity-100 transition-all shadow-xl z-50 whitespace-nowrap pointer-events-none translate-y-1 group-hover/user:translate-y-0">
                  {username}
                </div>
              )}

              {!isCollapsed && (
                <div className="min-w-0 flex-1 text-left transition-opacity duration-300 pr-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {username}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 truncate tracking-wide font-medium mt-0.5">
                    Free Plan
                  </p>
                </div>
              )}
            </button>

            {/* Logout Button (when expanded) */}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-2.5 opacity-60 hover:opacity-100 hover:bg-red-500/15 text-muted-foreground hover:text-red-500 rounded-xl transition-all duration-200 shrink-0 mr-0.5"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
