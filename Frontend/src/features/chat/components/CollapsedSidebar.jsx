import React, { useState } from "react";

const CollapsedSidebar = ({
  onToggleSidebar = () => {},
  onNewChat = () => {},
  chats = [],
  activeChat,
  onSelectChat = () => {},
}) => {
  const [showChatList, setShowChatList] = useState(false);

  return (
    <>
      {/* Collapsed Sidebar */}
      <aside className="hidden md:flex h-screen w-14 border-r border-white/5 bg-surface-container backdrop-blur-xl flex-col items-center py-2 gap-2.5 shrink-0">
        {/* Expand Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-white/80"
          title="Show sidebar"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>

        {/* Divider */}
        <div className="w-6 h-px bg-white/10"></div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-primary relative group"
          title="New chat"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container border border-white/10 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
            New chat
          </div>
        </button>

        {/* Chat History Button */}
        <button
          onClick={() => setShowChatList(!showChatList)}
          className="p-2 hover:bg-white/10 rounded-lg transition text-white/80 hover:text-secondary relative group"
          title="Chat history"
        >
          <span className="material-symbols-outlined">history</span>
          <div className="absolute left-full ml-2 px-2 py-1 bg-surface-container border border-white/10 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl">
            History
          </div>
        </button>
      </aside>

      {/* Chat List Dropdown */}
      {showChatList && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowChatList(false)}
          />

          {/* Dropdown Menu */}
          <div className="hidden md:flex absolute left-20 top-0 z-30 h-screen w-64 border-r border-white/5 bg-surface-container/95 backdrop-blur-xl flex-col">
            {/* Header */}
            <div className="border-b border-white/5 p-4 shrink-0">
              <h3 className="text-sm font-semibold text-white/80">
                Chat History
              </h3>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-styled">
              {chats && chats.length > 0 ? (
                chats.slice(0, 10).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat);
                      setShowChatList(false);
                    }}
                    className={`w-full rounded-lg text-left px-3 py-2 text-xs transition ${
                      activeChat?.id === chat.id
                        ? "bg-primary/10 border border-primary/30 text-white/80 shadow-lg shadow-primary/10"
                        : "bg-white/5 text-white/80 border border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`}
                    title={chat.title}
                  >
                    <p className="truncate font-medium">{chat.title}</p>
                    <p className="text-[10px] text-white/80 mt-1">
                      {chat.time}
                    </p>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-xs text-white/80 text-center">
                  No chats yet
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CollapsedSidebar;
