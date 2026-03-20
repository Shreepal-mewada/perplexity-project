import React from "react";
import { Menu, X, Plus, Search, Settings, ChevronLeft } from "lucide-react";

const Sidebar = ({
  chats = [],
  activeChat,
  onSelectChat,
  onNewChat,
  sidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  // sidebarVisibleDesktop = true,
  onToggleSidebarDesktop = () => {},
}) => {
  return (
    <>
      {/* Mobile Menu Button - Always visible on mobile */}
      <button
        onClick={() => onToggleSidebar(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-slate-700 rounded-lg transition text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => onToggleSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 z-40 h-screen w-80 shrink-0 border-r border-slate-700 bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="border-b border-slate-700 p-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl"></span>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold tracking-wide text-white">
                    Perplexity
                  </h1>
                  <p className="text-xs text-slate-400">AI Dashboard</p>
                </div>
              </div>
              {/* Hide Sidebar Button */}
              <button
                onClick={onToggleSidebarDesktop}
                className="hidden md:flex p-2 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white shrink-0"
                title="Hide sidebar"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-3 shrink-0">
            <button
              onClick={onNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-3 py-2 font-semibold text-white transition hover:bg-cyan-400"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/50 px-3 py-2">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 min-h-0 scrollbar-styled">
            <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Chat History
            </p>
            <div className="space-y-2">
              {chats && chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat);
                      onToggleSidebar(false);
                    }}
                    className={`w-full rounded-2xl border px-3 py-2 text-left transition ${
                      activeChat?.id === chat.id
                        ? "border-cyan-400/40 bg-cyan-500/10 text-white"
                        : "border-transparent bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                    title={chat.title}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {chat.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{chat.time}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-2 py-4 text-sm text-slate-400">No chats yet</p>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 p-3 shrink-0">
            <div className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <span>👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">User</p>
                  <p className="text-xs text-slate-500">Free Plan</p>
                </div>
              </div>
              <button className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
