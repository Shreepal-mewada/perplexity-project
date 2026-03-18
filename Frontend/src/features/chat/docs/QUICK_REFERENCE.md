# Dashboard Quick Reference Guide

Fast lookup for common tasks and component props.

## ⚡ Quick Props Reference

### Dashboard

**File**: `src/features/chat/pages/Dashboard.jsx`

**State**:

```javascript
const [chats, setChats] = useState([]); // Chat array
const [input, setInput] = useState(""); // Input text
const [activeChatId, setActiveChatId] = useState(1); // Selected ID
const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
const [rightPanelOpen, setRightPanelOpen] = useState(false); // Right panel
const [searchQuery, setSearchQuery] = useState(""); // Search text
```

**Handlers**:

```javascript
handleNewChat(); // Create new chat
handleSelectChat(chat); // Select different chat
handleSendMessage(msg); // Send message
```

---

### Sidebar

**File**: `src/features/chat/components/Sidebar.jsx`

**Props**:

```javascript
<Sidebar
  chats={filteredChats} // Chat list
  activeChat={activeChat} // Selected chat
  onSelectChat={handleSelectChat} // Selection handler
  onNewChat={handleNewChat} // New chat handler
  sidebarOpen={sidebarOpen} // Visibility
  onToggleSidebar={setSidebarOpen} // Toggle handler
  searchQuery={searchQuery} // Search text
  onSearchChange={setSearchQuery} // Search handler
/>
```

**Features**:

- Chat history list
- Search functionality
- User profile section
- New chat button
- Mobile responsive

---

### ChatArea

**File**: `src/features/chat/components/ChatArea.jsx`

**Props**:

```javascript
<ChatArea
  messages={activeChat?.messages || []} // Messages array
  loading={false} // Loading state
  currentTitle={activeChat?.title} // Chat title
/>
```

**Message Structure**:

```javascript
{
  id: 1,
  role: "user" | "assistant",
  text: "Message content..."
}
```

**Features**:

- Auto-scroll to latest
- Empty state with suggestions
- Loading indicator
- MessageBubble rendering

---

### MessageBubble

**File**: `src/features/chat/components/MessageBubble.jsx`

**Props**:

```javascript
<MessageBubble
  message={msg} // Message object
  sender="user" // "user" or "ai"
  isLoading={false} // Loading animation
/>
```

**Styling**:

- User: Right-aligned, cyan gradient
- AI: Left-aligned, dark background

---

### InputBar

**File**: `src/features/chat/components/InputBar.jsx`

**Props**:

```javascript
<InputBar
  onSendMessage={handleSendMessage} // Send callback
  disabled={!activeChat} // Disable state
  isLoading={false} // Loading state
/>
```

**Features**:

- Auto-expanding textarea
- Enter to send
- Shift+Enter for new line
- Action buttons
- Attach, voice, send

---

### RightPanel

**File**: `src/features/chat/components/RightPanel.jsx`

**Props**:

```javascript
<RightPanel
  isOpen={rightPanelOpen} // Panel visibility
  sources={[]} // Sources array
  relatedQuestions={[]} // Questions array
/>
```

**Features**:

- Dual-tab interface
- Sources list
- Related questions
- Quick actions
- Collapsible

---

## 🎨 CSS Variables

All in `styles/globals.css`:

```css
/* Colors */
--bg-primary: #0a0e27 --accent-primary: #00d9ff --text-primary: #e4e4e7
  --text-muted: #64748b /* Spacing */ --spacing-md: 1rem --spacing-lg: 1.5rem
  --spacing-xl: 2rem /* Radius */ --radius-lg: 1rem --radius-2xl: 2rem
  /* Shadows */ --shadow-glow: 0 0 40px rgba(0, 217, 255, 0.15)
  /* Transitions */ --transition-base: 200ms ease-in-out;
```

**Usage**:

```css
background: var(--accent-primary);
border-radius: var(--radius-2xl);
box-shadow: var(--shadow-glow);
transition: color var(--transition-base);
```

---

## 🔧 Common Tasks

### Add New Chat

```javascript
const handleNewChat = () => {
  const newChat = {
    id: Date.now(),
    title: "New Chat",
    time: "now",
    messages: [],
  };
  setChats([newChat, ...chats]);
  setActiveChatId(newChat.id);
};
```

### Send Real Message (via socket)

```javascript
const handleSendMessage = (messageText) => {
  // Add to local state (optimistic update)
  const userMessage = {
    id: Date.now(),
    role: "user",
    text: messageText,
  };

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat,
    ),
  );

  // Send to backend
  socket.emit("send_message", {
    chatId: activeChatId,
    message: messageText,
  });
};
```

### Listen for Server Response

```javascript
useEffect(() => {
  socket?.on("ai_response", (data) => {
    const aiMessage = {
      id: Date.now(),
      role: "assistant",
      text: data.message,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === data.chatId
          ? { ...chat, messages: [...chat.messages, aiMessage] }
          : chat,
      ),
    );
  });

  return () => socket?.off("ai_response");
}, [activeChatId]);
```

### Filter Chats (Search)

```javascript
const filteredChats = useMemo(() => {
  if (!searchQuery.trim()) return chats;
  return chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}, [chats, searchQuery]);
```

### Get Active Chat

```javascript
const activeChat = useMemo(
  () => chats.find((chat) => chat.id === activeChatId),
  [chats, activeChatId],
);
```

### Toggle Mobile Sidebar

```javascript
<button onClick={() => setSidebarOpen(!sidebarOpen)}>Menu</button>;

{
  sidebarOpen && (
    <div onClick={() => setSidebarOpen(false)}>
      <Sidebar {...props} />
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Messages Not Showing

**Problem**: New messages don't appear

```javascript
// ❌ Wrong - not updating array reference
message.messages.push(newMessage);

// ✅ Correct - creating new array
{...chat, messages: [...chat.messages, newMessage]}
```

### Socket Not Connected

**Problem**: Messages never sent

```javascript
// Check globals.js
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Verify in browser console
console.log(socket.connected);
```

### Styling Not Applied

**Problem**: Colors or spacing looks wrong

```javascript
// Ensure globals.css imported first in main.jsx
import "./features/chat/styles/globals.css"; // ← Must be first
import App from "./app/App";
```

### Input Not Sending

**Problem**: Send button doesn't work

```javascript
// Check onSendMessage is connected
<InputBar onSendMessage={handleSendMessage} />;

// Verify handler
const handleSendMessage = (message) => {
  console.log("Sending:", message); // Debug
  // ... send logic
};
```

### Mobile Layout Broken

**Problem**: Sidebar or layout looks off on mobile

```css
/* Check media queries in globals.css */
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
}
```

---

## 📊 Component Tree

```
Dashboard
├── Sidebar
│   ├── Logo
│   ├── New Chat Button
│   ├── Search Input
│   ├── Chat History List
│   │   └── Chat Items
│   └── User Profile
├── ChatArea
│   ├── Header
│   ├── Messages Container
│   │   └── MessageBubble[]
│   │       ├── User Messages
│   │       └── AI Messages
│   └── Empty State (or Messages)
├── InputBar
│   ├── Attach Button
│   ├── Textarea
│   ├── Voice Button
│   └── Send Button
└── RightPanel (conditional)
    ├── Tab Navigation
    ├── Sources Tab (or)
    └── Related Questions Tab
```

---

## 🚀 Deployment Checklist

- [ ] All components imported
- [ ] All CSS files imported in order
- [ ] Socket URL points to production server
- [ ] API endpoints use environment variables
- [ ] Auth token included in socket/API calls
- [ ] Error handling for socket disconnects
- [ ] Loading states for API calls
- [ ] Mobile responsive tested
- [ ] Accessibility tested
- [ ] Performance optimized

---

## 🎵 Keyboard Shortcuts

| Key             | Action                         |
| --------------- | ------------------------------ |
| `Enter`         | Send message                   |
| `Shift + Enter` | New line in input              |
| `Cmd/Ctrl + K`  | Search chats (could implement) |
| `Esc`           | Close sidebar (mobile)         |

---

## 📱 Responsive Breakpoints

| Device  | Width           | Layout                    |
| ------- | --------------- | ------------------------- |
| Mobile  | < 640px         | Single column, stacked    |
| Tablet  | 640px - 1024px  | Sidebar + main            |
| Desktop | 1024px - 1280px | Sidebar + main (no right) |
| Large   | > 1280px        | All panels visible        |

---

## 💾 Data Structure

### Chat Object

```javascript
{
  id: 1,                    // Unique ID
  title: "React State",     // Chat name
  time: "2m ago",          // Last activity
  messages: [              // Message history
    {
      id: 1,
      role: "user" | "assistant",
      text: "Message..."
    }
  ]
}
```

### Socket Events

**Client → Server**:

```javascript
socket.emit("send_message", {
  chatId: number,
  message: string,
  userId: string,
});
```

**Server → Client**:

```javascript
socket.on("ai_response", {
  chatId: number,
  message: string,
  timestamp: number,
});
```

---

## 📚 Import Paths

```javascript
// Components
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatArea from "./components/ChatArea/ChatArea";
import MessageBubble from "./components/MessageBubble/MessageBubble";
import InputBar from "./components/InputBar/InputBar";
import RightPanel from "./components/RightPanel/RightPanel";

// Styles
import "./styles/globals.css";
import "./styles/Dashboard.css";
import "./styles/Sidebar.css";
import "./styles/ChatArea.css";
import "./styles/MessageBubble.css";
import "./styles/InputBar.css";
import "./styles/RightPanel.css";

// Services
import { initializeSocketConnection } from "./service/chat.socket";
import { useChat } from "./hooks/useChat";
```

---

## 🔗 Documentation Links

| Document             | Purpose                      |
| -------------------- | ---------------------------- |
| INTEGRATION_GUIDE.md | Setup & backend integration  |
| DASHBOARD_README.md  | Detailed component docs      |
| CREATE_SUMMARY.md    | Creation process & decisions |
| QUICK_REFERENCE.md   | This file                    |

---

## 💡 Tips & Tricks

### Fast Theme Change

```css
/* globals.css */
:root {
  --accent-primary: #00d9ff; /* Change here */
  --bg-primary: #0a0e27;
}
```

### Add Custom Animation

```css
/* globals.css */
@keyframes myAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.my-class {
  animation: myAnimation 0.3s ease-in-out;
}
```

### Debug Socket Connection

```javascript
useEffect(() => {
  const socket = getSocket();
  console.log("Connected:", socket?.connected);
  console.log("ID:", socket?.id);
}, []);
```

### Check Redux Auth

```javascript
const user = useSelector((state) => state.auth.user);
const token = useSelector((state) => state.auth.token);
console.log("User:", user, "Token:", token?.slice(0, 10) + "...");
```

---

## 📞 Quick Start

```bash
# 1. Install dependencies
npm install lucide-react socket.io-client

# 2. Import globals.css in main.jsx
import './features/chat/styles/globals.css';

# 3. Configure socket service
# Edit: src/features/chat/service/chat.socket.js

# 4. Connect socket in Dashboard.jsx
useEffect(() => {
  chat.initializeSocketConnection();
}, []);

# 5. Implement handleSendMessage
# Replace demo logic with real socket.emit()

# 6. Listen for responses
socket.on('ai_response', (data) => {
  // Update messages
});
```

---

**Version**: 1.0.0  
**Last Updated**: Current Session  
**Status**: Production Ready
