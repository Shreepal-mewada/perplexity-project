import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";
import appIcon from "../../../assets/image.png";

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

  // Collapsed sidebar view - Icon only
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex h-screen w-15 border-r border-white/5 bg-[#212121] flex-col items-center py-3 gap-3 shrink-0 justify-between">
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Expand Sidebar Button (App Logo) */}
          <button
            onClick={onToggleSidebarDesktop}
            className="p-3 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white/80"
            title="Show sidebar"
          >
            <img
              src={appIcon}
              alt="App Icon"
              className="w-7 h-7 object-cover rounded-full"
            />
          </button>

          {/* Divider */}
          <div className="w-8 h-px bg-white/10"></div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className=" p-3 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-primary relative group"
            title="New chat"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <div className="absolute left-full ml-2 px-1.5 py-0.5 bg-surface-container border border-white/10 text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
              New Chat
            </div>
          </button>

          {chats && chats.length > 0 && (
            <>
              {/* Chat History Icon */}
              <button
                onClick={onToggleSidebarDesktop}
                className="p-3 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-primary relative group"
                title="Chat History"
              >
                <span className="material-symbols-outlined">history</span>
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container border border-white/10 text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
                  Chat History
                </div>
              </button>

              {/* Search Chat Icon */}
              <button
                onClick={onToggleSidebarDesktop}
                className="p-3 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-primary relative group"
                title="Search Chat"
              >
                <span className="material-symbols-outlined">search</span>
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container border border-white/10 text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
                  Search Chat
                </div>
              </button>
            </>
          )}
        </div>

        {/* User Profile Button at Bottom */}
        <div className="flex bg-[#272727] rounded-full flex-col items-center gap-1 mb-1  hover:rounded-full">
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/20 rounded-full transition text-red-500/80 relative group flex items-center justify-center -mb-1 mt-1 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <div className="absolute left-full ml-2 px-1.5 py-0.5 bg-surface-container border border-white/10 text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl z-50">
              Logout
            </div>
          </button>
          
          <button
            onClick={onToggleSidebarDesktop}
            className="p-1 hover:bg-white/10  hover:rounded-full transition text-secondary relative group"
          >
            <div className="flex h-8 w-8 items-center  hover:rounded-full justify-center rounded-full bg-secondary/20 text-secondary font-bold text-xs text-amber-50">
              {initial}
            </div>
            <div className=" hover:rounded-full absolute left-full ml-2 px-1.5 py-0.5 bg-surface-container border border-white/10 text-white/80 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
              {username}
            </div>
          </button>
        </div>
      </aside>
    );
  }

  // Full sidebar view
  return (
    <>
      {/* Sidebar Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => onToggleSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 z-40 h-[100dvh] w-80 shrink-0 border-r border-white/5 bg-surface-container backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="border-b border-white/5 p-3 shrink-0 ">
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex items-center gap-2 flex-1 min-w-0 rounded-full">
                <div className="w-7 h-7  overflow-hidden flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 bg-white/10 rounded-full">
                  <img
                    src={appIcon}
                    alt="App Icon"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-bold tracking-tight text-white/80 font-headline">
                    Zyricon AI
                  </h1>
                  {/* <p className="text-xs text-white/80 font-medium">Premium</p> */}
                </div>
              </div>
              {/* Hide Sidebar Button */}
              <button
                onClick={onToggleSidebarDesktop}
                className="hidden md:flex p-2 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white/80 shrink-0"
                title="Hide sidebar"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {/* Close Mobile Sidebar Button */}
              <button
                onClick={() => onToggleSidebar(false)}
                className="md:hidden flex p-2 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white/80 shrink-0"
                title="Close sidebar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-2 py-2 shrink-0 z-10">
            <button
              onClick={onNewChat}
              className="group relative w-full flex items-center  gap-1.5 px-1 py-2.5 font-semibold text-white/80 rounded-xl overflow-hidden transition-all duration-300 active:scale-95"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-r from-primary via-primary-container to-primary rounded-xl opacity-100 group-hover:opacity-110 transition-opacity duration-300" />

              {/* Border Glow */}
              <div className="absolute inset-0 rounded-xl border border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Shadow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary-container rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300 -z-10" />

              {/* Content */}
              <span className="material-symbols-outlined text-xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                add_circle
              </span>
              <span className="relative z-10 font-headline font-bold text-sm">
                New Chat
              </span>
            </button>
          </div>

          {/* Search Bar */}
          {chats && chats.length > 0 && (
            <div className="px-2 pb-6 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-2 py-1.5 hover:border-white/20 transition">
                <span
                  className="material-symbols-outlined text-white/80 text-base"
                  title="Search Chat"
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-transparent text-xs text-white/80 placeholder:text-white/80 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Chat History */}
          {chats && chats.length > 0 && (
            <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-0 scrollbar-styled">
              <div className="flex items-center gap-1 px-1 pb-2">
                <span
                  className="material-symbols-outlined text-white/80 text-base"
                  title="Chat History"
                >
                  history
                </span>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  Chat History
                </p>
              </div>
              <div className="space-y-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat);
                      onToggleSidebar(false);
                    }}
                    className={`group w-full rounded-xl border px-2 py-2 text-left transition flex items-center justify-between gap-2 ${
                      activeChat?.id === chat.id
                        ? "border-primary/30 bg-primary/10 text-white/80 shadow-lg shadow-primary/10"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                    }`}
                    title={chat.title}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">
                        {chat.title}
                      </p>
                      <p className="mt-1 text-[10px] text-white/80">
                        {chat.time}
                      </p>
                    </div>
                    <div
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-md transition-all shrink-0"
                      title="Delete chat"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section - User Profile Only */}
          <div className="border-t border-white/5 p-2 shrink-0 mt-auto">
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl p-2 hover:border-white/20 transition group">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary font-bold text-xs">
                  {initial}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-white/80 truncate">
                    {username}
                  </p>
                  <p className="text-[10px] text-white/80 truncate">Free Plan</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-md transition-all shrink-0"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
