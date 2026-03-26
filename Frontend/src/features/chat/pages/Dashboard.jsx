import { useChat } from "../hooks/useChat";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChatId } from "../chat.slice";
// import PremiumSidebar from "../components/PremiumSidebar";
// import PremiumTopHeader from "../components/PremiumTopHeader";
// import PremiumWorkspace from "../components/PremiumWorkspace";
import ChatArea from "../components/ChatArea";
import InputBar from "../components/InputBar";
// import RightPanel from "../components/RightPanel";
import CollapsedRightPanel from "../components/CollapsedRightPanel";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const chat = useChat();
  const dispatch = useDispatch();
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar open state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop sidebar collapsed state
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatInterface, setShowChatInterface] = useState(false); // Show chat interface after starting a chat
  const [hasInitialized, setHasInitialized] = useState(false); // Track if initial chats fetch is done
  const [initialSelectDone, setInitialSelectDone] = useState(false); // Prevent infinite loop on "New Chat"

  // Fetch chats on component mount
  useEffect(() => {
    const loadChats = async () => {
      await chat.handleGetChats();
      setHasInitialized(true);
    };
    loadChats();
    // NOTE: intentionally empty dependencies to avoid repeated polling
    // when `chat` object reference changes on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-select the most recent chat if there are chats but no currentChatId
  useEffect(() => {
    const initRecentChat = async () => {
      if (!hasInitialized || initialSelectDone) return;

      const chatIds = Object.keys(chats);

      if (chatIds.length === 0) {
        // no existing chats -> open new chat view
        setShowChatInterface(true);
        setInitialSelectDone(true);
        return;
      }

      if (!currentChatId) {
        const mostRecentChatId = chatIds.reduce((latest, current) => {
          const latestTime = new Date(chats[latest].lastUpdated).getTime();
          const currentTime = new Date(chats[current].lastUpdated).getTime();
          return currentTime > latestTime ? current : latest;
        });

        dispatch(setCurrentChatId(mostRecentChatId));
        await chat.handleOpenChat(mostRecentChatId);
        setShowChatInterface(true);
      }

      setInitialSelectDone(true);
    };

    initRecentChat();
  }, [hasInitialized, chats, currentChatId, dispatch, chat, initialSelectDone]);

  // Auto-show chat interface if currentChatId exists
  useEffect(() => {
    if (currentChatId && hasInitialized) {
      setShowChatInterface(true);
    }
  }, [currentChatId, hasInitialized]);

  // Convert chats object to array for sidebar (sorted by newest first)
  const chatsArray = useMemo(() => {
    return Object.values(chats)
      .map((chat) => {
        const date = new Date(chat.lastUpdated);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
        return {
          ...chat,
          time: formattedDate,
        };
      })
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
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
    chat.handleNewChat();
    setShowChatInterface(true);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const handleSelectChat = async (selectedChat) => {
    await chat.handleOpenChat(selectedChat.id);
    setShowChatInterface(true);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      setShowChatInterface(true);
      await chat.handleSendMessage({
        message: message.trim(),
        chatId: currentChatId || null,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Show Welcome Screen only if initialized AND no chats and no chat interface request
  if (
    hasInitialized &&
    Object.keys(chats).length === 0 &&
    !currentChatId &&
    !showChatInterface
  ) {
    return (
      <div className="h-[100dvh] w-full bg-[#212121] text-white/80 font-body selection:bg-primary/30 overflow-hidden">
        {/* Mobile: Show hamburger menu, Desktop: Show Premium Sidebar */}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <PremiumSidebar
            onNewChat={handleNewChat}
            chats={filteredChats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            isCollapsed={false}
            onToggleSidebar={() => { }}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden">
            <PremiumSidebar
              onNewChat={() => {
                handleNewChat();
                setSidebarOpen(false);
              }}
              chats={filteredChats}
              activeChat={activeChat}
              onSelectChat={(chat) => {
                handleSelectChat(chat);
                setSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleSidebar={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Top Header */}
        <PremiumTopHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          isCollapsed={false}
        />

        {/* Main Content - Responsive layout */}
        <main
          className="h-[100dvh] w-full relative flex flex-col bg-[#212121] transition-all duration-300 md:ml-60 md:w-[calc(100%-15rem)] overflow-hidden"
          id="main-content"
        >
          <PremiumWorkspace onSendMessage={handleSendMessage} />
        </main>

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show loading screen while initializing
  if (!hasInitialized) {
    return (
      <div className="h-[100dvh] w-full overflow-hidden bg-[#212121] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-secondary/20 animate-spin">
            <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary"></div>
          </div>
          <p className="text-white/80">Loading chats...</p>
        </div>
      </div>
    );
  }

  // Show Chat Interface after message is sent or chat is selected
  return (
    <div className="h-[100dvh] w-full bg-[#212121] flex flex-col md:flex-row overflow-hidden relative">
      {/* Sidebar - Show collapsed button on desktop if hidden, else show full sidebar */}
      <div className="transition-all duration-300 md:flex-shrink-0">
        <Sidebar
          chats={filteredChats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={setSidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebarDesktop={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCollapsed={sidebarCollapsed}
          onDeleteChat={chat.handleDeleteChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-h-0 w-full transition-all duration-300">
        {/* Top Header for Chat Interface */}
        <header className="h-14 md:h-11 flex items-center px-4 md:px-4 z-40 bg-[#212121] backdrop-blur-xl shrink-0 gap-3 md:gap-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center justify-center p-2 -ml-2 hover:bg-white/5 rounded-lg transition text-white/80"
            title="Open sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Chat Title Container - Zyricon AI Always Visible */}
          <h2 className="text-base md:text-sm font-bold text-white/80 truncate">
            Zyricon AI
          </h2>
        </header>

        <div className="flex-1 min-h-0">
          <ChatArea
            messages={activeChat?.messages || []}
            loading={isLoading}
            currentTitle={activeChat?.title || "New Chat"}
            rightPanelVisible={rightPanelOpen}
            onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          />
        </div>

        <div className="flex-shrink-0">
          <InputBar
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Right Panel */}
      {/* {rightPanelOpen ? (
        <div className="transition-all duration-300">
          <RightPanel
            isOpen={rightPanelOpen}
            sources={activeChat?.sources || []}
            relatedQuestions={activeChat?.relatedQuestions || []}
            onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
          />
        </div>
      ) : (
        <CollapsedRightPanel
          onToggleRightPanel={() => setRightPanelOpen(true)}
        />
      )} */}
    </div>
  );
}

export default Dashboard;
