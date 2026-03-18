# Dashboard Integration Guide

Complete guide for integrating the Perplexity-inspired Dashboard with your backend and socket services.

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install lucide-react
# If not already installed:
npm install socket.io-client
npm install redux react-redux
npm install axios
```

### Step 2: Tailwind CSS Configuration

Ensure your `tailwind.config.js` includes the chat feature path:

```javascript
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/features/chat/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          // Tailwind default slate colors
        },
        cyan: {
          // Tailwind default cyan colors
        },
      },
    },
  },
  plugins: [],
};
```

**Note**: All components use **Tailwind CSS utility classes** directly. No separate CSS files are needed.

### Step 3: Ensure Socket Service Exists

Update your socket service at `src/features/chat/service/chat.socket.js`:

```javascript
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

export const initializeSocketConnection = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("new_message", (data) => {
      // Handle incoming messages
      console.log("New message:", data);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const sendMessage = (message) => {
  if (socket) {
    socket.emit("send_message", message);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

## 🔌 Connecting Components to Backend

### Dashboard.jsx Props Explanation

The Dashboard component uses these state variables:

```javascript
// State Management
const [chats, setChats] = useState([...]);        // Array of chat objects
const [input, setInput] = useState('');           // Current message input
const [activeChat, setActiveChat] = useState(...) // Currently selected chat
const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle
const [rightPanelOpen, setRightPanelOpen] = useState(false); // Right panel toggle
const [searchQuery, setSearchQuery] = useState(''); // Chat search filter
```

### Implementing Real Data

Replace demo data in `Dashboard.jsx`:

```javascript
// Before: Static demo data
const [chats, setChats] = useState([{id: 1, title: "...", messages: [...]}]);

// After: Fetch from API
useEffect(() => {
  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chats');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };
  fetchChats();
}, []);
```

### Socket Message Handling

Update `handleSendMessage` to use real socket communication:

```javascript
const handleSendMessage = (messageText) => {
  if (!messageText.trim() || !activeChat) return;

  // Create user message object
  const userMessage = {
    id: Date.now(),
    role: "user",
    text: messageText.trim(),
  };

  // Add to state immediately (optimistic update)
  setChats((prev) =>
    prev.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat,
    ),
  );

  // Send via socket to backend
  socket.emit("send_message", {
    chatId: activeChatId,
    message: messageText,
    userId: userIdFromAuth,
  });

  // Clear input
  setInput("");
};

// Listen for AI responses
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

  return () => {
    socket?.off("ai_response");
  };
}, [activeChatId]);
```

## 📱 Component Props Reference

### Sidebar

```jsx
<Sidebar
  chats={filteredChats} // Array of chat objects
  activeChat={activeChat} // Currently selected chat
  onSelectChat={handleSelectChat} // Callback: (chat) => void
  onNewChat={handleNewChat} // Callback: () => void
  sidebarOpen={sidebarOpen} // Boolean: is sidebar visible
  onToggleSidebar={setSidebarOpen} // Callback: (bool) => void
  searchQuery={searchQuery} // String: search input value
  onSearchChange={setSearchQuery} // Callback: (string) => void
/>
```

### ChatArea

```jsx
<ChatArea
  messages={activeChat?.messages || []} // Array of message objects
  loading={false} // Boolean: is AI responding
  currentTitle={activeChat?.title} // String: chat title
/>
```

### InputBar

```jsx
<InputBar
  onSendMessage={handleSendMessage} // Callback: (message: string) => void
  disabled={!activeChat} // Boolean: disable when no chat selected
  isLoading={false} // Boolean: show loading state
/>
```

### RightPanel

```jsx
<RightPanel
  isOpen={rightPanelOpen} // Boolean: is panel visible
  sources={[]} // Array of source objects
  relatedQuestions={[]} // Array of question strings
/>
```

### MessageBubble

```jsx
<MessageBubble
  message={message}                  // Object: {id, role, text}
  sender="user" | "ai"              // String: message sender
  isLoading={false}                 // Boolean: show loading animation
/>
```

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `globals.css`:

```css
:root {
  /* Change primary accent color */
  --accent-primary: #00d9ff; /* Cyan */

  /* Change backgrounds */
  --bg-primary: #0a0e27;
  --bg-secondary: #1a1a3a;

  /* Change text colors */
  --text-primary: #e4e4e7;
  --text-muted: #64748b;
}
```

### Adjust Breakpoints

Mobile breakpoints use Tailwind defaults:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Modify in component CSS files or update Tailwind config.

### Theme Animations

Available animation utilities in `globals.css`:

- `animate-pulse` - Soft fade pulse
- `animate-bounce` - Bouncy animation
- `animate-glow` - Glowing text effect
- `shimmer-loading` - Shimmer skeleton loading

## 🔒 Authentication Integration

Connect with your auth system:

```javascript
import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // Use in Sidebar user section
  // Use in API calls as authorization header
  // Use to identify messages as belonging to current user
}
```

## ⚙️ Environment Variables

Create `.env.local`:

```env
VITE_SOCKET_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_MODEL=gpt-4
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Update Socket URL for Production

```javascript
const SOCKET_URL = import.meta.env.PROD
  ? "https://your-domain.com"
  : "http://localhost:5000";
```

### Enable Compression

In `vite.config.js`:

```javascript
import compression from "vite-plugin-compression";

export default {
  plugins: [
    compression({
      ext: [".js", ".css"],
    }),
  ],
};
```

## 📊 Performance Optimization

### Memoization

Components already use `useMemo` for expensive calculations:

```javascript
const filteredChats = useMemo(() => {
  // This only recalculates when chats or searchQuery changes
  return chats.filter(...);
}, [chats, searchQuery]);
```

### Virtual Scrolling (Optional)

For large message lists, consider `react-virtual`:

```bash
npm install react-virtual
```

Then update ChatArea to use virtual scrolling.

### Code Splitting

Lazy load Dashboard in AppRoutes:

```javascript
const Dashboard = lazy(() => import("./pages/Dashboard"));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>;
```

## 🐛 Common Issues & Solutions

### Socket Connection Fails

- Check backend is running on correct URL
- Verify CORS is enabled in backend
- Check browser console for connection errors

### Messages Not Updating

- Ensure socket event names match backend
- Verify Redux state is being updated
- Check useEffect dependencies

### Styling Not Applied

- Ensure all CSS files are imported in order
- Clear browser cache (Ctrl+Shift+Delete)
- Run `npm install` to ensure Tailwind processes all classes

### Input Not Sending

- Check `disabled` prop on InputBar
- Verify `onSendMessage` callback is firing
- Check message text is not empty

## 📚 Further Reading

- [Socket.IO Documentation](https://socket.io/docs/client-api/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
