import { useChat } from "../hooks/useChat";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import CollapsedSidebar from "../components/CollapsedSidebar";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
import RightPanel from "../components/RightPanel";
import CollapsedRightPanel from "../components/CollapsedRightPanel";

function Dashboard() {
  const chat = useChat();
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [sidebarVisibleDesktop, setSidebarVisibleDesktop] = useState(true); // Desktop sidebar
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
      {/* Sidebar or Collapsed Sidebar - Fixed width with transitions */}
      {sidebarVisibleDesktop ? (
        <div className="transition-all duration-300">
          <Sidebar
            chats={filteredChats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sidebarVisibleDesktop={sidebarVisibleDesktop}
            onToggleSidebarDesktop={() =>
              setSidebarVisibleDesktop(!sidebarVisibleDesktop)
            }
          />
        </div>
      ) : (
        <div className="transition-all duration-300">
          <CollapsedSidebar
            onToggleSidebar={() => setSidebarVisibleDesktop(true)}
            onNewChat={handleNewChat}
            chats={filteredChats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
          />
        </div>
      )}

      {/* Main Chat Area - Flexible width that expands when panels close */}
      <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden transition-all duration-300">
        <ChatArea
          messages={activeChat?.messages || []}
          loading={isLoading}
          currentTitle={activeChat?.title || "New Chat"}
          rightPanelVisible={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        />
        <InputBar
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>

      {/* Right Insights Panel or Collapsed Right Panel */}
      {rightPanelOpen ? (
        <div className="transition-all duration-300">
          <RightPanel
            isOpen={rightPanelOpen}
            sources={[]}
            relatedQuestions={[]}
            rightPanelVisible={rightPanelOpen}
            onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          />
        </div>
      ) : (
        <CollapsedRightPanel
          onToggleRightPanel={() => setRightPanelOpen(true)}
        />
      )}
    </div>
  );
}

export default Dashboard;
