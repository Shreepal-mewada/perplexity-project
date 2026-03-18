import { useChat } from "../hooks/useChat";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import RightPanel from "../components/RightPanel";

function Dashboard() {
  const chat = useChat();
  const dispatch = useDispatch();
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch chats on component mount
  useEffect(() => {
    chat.handleGetChats();
  }, []);

  // Convert chats object to array for sidebar
  const chatsArray = useMemo(() => {
    return Object.values(chats).map((chat) => ({
      ...chat,
      time: new Date(chat.lastUpdated).toLocaleString(),
    }));
  }, [chats]);

  // Current chat
  const activeChat = useMemo(() => {
    return chats[currentChatId];
  }, [chats, currentChatId]);

  // Filter chats based on search
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chatsArray;
    return chatsArray.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chatsArray, searchQuery]);

  const handleNewChat = async () => {
    // Clear current selection to show empty chat area
    chat.handleNewChat();
  };

  const handleSelectChat = async (selectedChat) => {
    // Fetch messages for this chat
    await chat.handleOpenChat(selectedChat.id);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      // If no current chat, pass null as chatId - backend will create new chat
      await chat.handleSendMessage({
        message: message.trim(),
        chatId: currentChatId || null,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row">
      <Sidebar
        chats={filteredChats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={setSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <ChatArea
          messages={activeChat?.messages || []}
          loading={isLoading}
          currentTitle={activeChat?.title || "New Chat"}
        />
        <InputBar
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>

      {rightPanelOpen && (
        <RightPanel
          isOpen={rightPanelOpen}
          sources={[]}
          relatedQuestions={[]}
        />
      )}
    </div>
  );
}

export default Dashboard;
