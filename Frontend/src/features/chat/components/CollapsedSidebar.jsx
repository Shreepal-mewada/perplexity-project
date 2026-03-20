import React, { useState } from "react";
import { ChevronRight, Plus, History } from "lucide-react";

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
      <aside className="hidden md:flex h-screen w-20 border-r border-slate-700 bg-slate-900/95 backdrop-blur-xl flex-col items-center py-4 gap-4 shrink-0">
        {/* Expand Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-3 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white"
          title="Show sidebar"
        >
          <ChevronRight size={20} />
        </button>

        {/* Divider */}
        <div className="w-8 h-px bg-slate-700"></div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="p-3 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white relative group"
          title="New chat"
        >
          <Plus size={20} />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            New chat
          </div>
        </button>

        {/* Chat History Button */}
        <button
          onClick={() => setShowChatList(!showChatList)}
          className="p-3 hover:bg-slate-700 rounded-lg transition text-slate-400 hover:text-white relative group"
          title="Chat history"
        >
          <History size={20} />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
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
          <div className="hidden md:flex absolute left-20 top-0 z-30 h-screen w-64 border-r border-slate-700 bg-slate-900/95 backdrop-blur-xl flex-col">
            {/* Header */}
            <div className="border-b border-slate-700 p-4 shrink-0">
              <h3 className="text-sm font-semibold text-white">Chat History</h3>
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
                        ? "bg-cyan-500/10 border border-cyan-400/40 text-white"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                    }`}
                    title={chat.title}
                  >
                    <p className="truncate font-medium">{chat.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {new Date(chat.lastUpdated).toLocaleDateString()}
                    </p>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-xs text-slate-400 text-center">
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
