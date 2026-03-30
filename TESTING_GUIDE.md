# 🧪 Chat Data Isolation - Manual Testing Guide

## Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- Two test user accounts (or ability to register new users)

---

## Test Suite 1: Basic Chat Isolation

### Test 1.1: New User Chat Visibility
**Objective**: Verify new users see only their own chats

**Steps**:
1. Open browser incognito window
2. Register as **User A** (usera@test.com)
3. Create 2-3 test chats with messages
4. Logout completely
5. Open NEW incognito window
6. Register as **User B** (userb@test.com)
7. Navigate to chat list

**Expected Result**:
- ✅ User B sees ZERO chats (empty chat list)
- ✅ No chats from User A appear
- ✅ Redux state shows `chats: {}`

**Fail Condition**:
- ❌ User B sees any of User A's chats
- ❌ Chat list contains "New Chat" titles from User A

---

### Test 1.2: Direct Chat ID Access Control
**Objective**: Prevent unauthorized access via chat ID manipulation

**Steps**:
1. Login as **User A**
2. Create a chat and note its ID from URL or network tab (e.g., `65f1a2b3c4d5e6f7g8h9i0j1`)
3. Logout
4. Login as **User B**
5. Open browser DevTools → Network tab
6. Manually send GET request: `GET /api/chats/messages/{UserA_Chat_ID}`
   - Use browser fetch API or Postman with User B's cookies

**Expected Result**:
- ✅ HTTP 403 Forbidden response
- ✅ Error message: "Access denied. This chat does not belong to you."

**How to Test (Browser Console)**:
```javascript
fetch('http://localhost:3000/api/chats/messages/65f1a2b3c4d5e6f7g8h9i0j1', {
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

**Fail Condition**:
- ❌ Returns 200 OK with messages
- ❌ User B can see User A's chat messages

---

## Test Suite 2: Logout State Cleanup

### Test 2.1: Redux State After Logout
**Objective**: Verify complete state cleanup on logout

**Steps**:
1. Login as any user
2. Create a chat, send some messages
3. Open Redux DevTools (browser extension)
4. Observe `chat` slice state (should show chats data)
5. Click logout button
6. Immediately check Redux state

**Expected Result**:
- ✅ `state.chat.chats = {}` (empty object)
- ✅ `state.chat.currentChatId = null`
- ✅ `state.chat.fileContext = null`
- ✅ `state.auth.user = null`
- ✅ All chat data removed from store

**Fail Condition**:
- ❌ Any chat data persists in Redux store after logout
- ❌ `currentChatId` still set after logout

---

### Test 2.2: UI State After Re-login
**Objective**: Ensure fresh state for next user

**Steps**:
1. Login as **User A**, create 3 chats
2. Logout
3. Login as **User B** (new user, no chats)
4. Watch the chat list UI

**Expected Result**:
- ✅ Shows empty chat list OR loading skeleton briefly then empty
- ✅ No flash of User A's chats
- ✅ No old chat titles visible

**Fail Condition**:
- ❌ Brief flash of User A's chats before disappearing
- ❌ User B sees User A's chat titles temporarily

---

## Test Suite 3: File/RAG Isolation

### Test 3.1: PDF Upload Access Control
**Objective**: Prevent cross-user file access

**Steps**:
1. Login as **User A**
2. Upload a PDF document in a chat
3. Note the `fileId` from network response
4. Logout
5. Login as **User B**
6. Try to upload a file in a new chat
7. Check if User B can somehow access User A's fileId

**Manual API Test**:
```javascript
// As User B, try to query User A's file
fetch('http://localhost:3000/api/files/65f1a2b3c4d5e6f7g8h9i0j1/status', {
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

**Expected Result**:
- ✅ User B cannot see User A's file in their chat history
- ✅ File status API returns 404 for User B
- ✅ RAG queries from User B don't use User A's file context

---

### Test 3.2: Cross-User RAG Query Prevention
**Objective**: Ensure RAG system doesn't leak documents across users

**Setup**:
- User A uploads a unique PDF (e.g., "Project Alpha Requirements")
- Document contains specific keywords like "AlphaCorp initiative"

**Steps**:
1. Login as **User A**, upload "AlphaCorp.pdf"
2. Ask: "What is the AlphaCorp initiative?"
3. Verify AI answers based on document ✓
4. Logout
5. Login as **User B**
6. Create new chat (no file attached)
7. Ask same question: "What is the AlphaCorp initiative?"

**Expected Result**:
- ✅ User B receives general LLM response (not based on User A's document)
- ✅ No mention of document excerpts
- ✅ Response indicates no knowledge of "AlphaCorp" from uploaded files

**Fail Condition**:
- ❌ User B gets answer citing User A's uploaded document
- ❌ AI references "the uploaded document" for User B

---

## Test Suite 4: Concurrent User Testing

### Test 4.1: Simultaneous Different Users
**Objective**: Verify isolation with concurrent active users

**Setup**:
- Browser Window 1: Logged in as **User A**
- Browser Window 2: Logged in as **User B** (different browser or incognito)

**Steps**:
1. Window 1 (User A): Create chat "Project X", send message "Test A1"
2. Window 2 (User B): Refresh chat list
3. Window 2 (User B): Create chat "Project Y", send message "Test B1"
4. Window 1 (User A): Refresh chat list

**Expected Result**:
- ✅ Window 1 shows ONLY "Project X" chat
- ✅ Window 2 shows ONLY "Project Y" chat
- ✅ Neither user sees the other's chat
- ✅ Messages stay isolated

---

### Test 4.2: Message Sending Isolation
**Objective**: Prevent message leakage across users

**Steps**:
1. User A: Send message "Hello from A" in their chat
2. User B: Send message "Hello from B" in their chat
3. User A: Refresh and check messages
4. User B: Refresh and check messages

**Expected Result**:
- ✅ User A sees ONLY "Hello from A"
- ✅ User B sees ONLY "Hello from B"
- ✅ No mixed messages

---

## Test Suite 5: Edge Cases

### Test 5.1: Token Refresh Security
**Objective**: Verify token refresh maintains user isolation

**Steps**:
1. Login as **User A**, create chats
2. Wait for access token to expire (15 min) OR manually clear it
3. System should auto-refresh using refresh token
4. Fetch chats again

**Expected Result**:
- ✅ Still shows only User A's chats after refresh
- ✅ No data from other users

---

### Test 5.2: Session Invalidation
**Objective**: Verify logout invalidates session properly

**Steps**:
1. Login as **User A**, create chats
2. Logout
3. Try to reuse old access token (via API call)
4. Try to access chats with old token

**Expected Result**:
- ✅ Old tokens rejected (401 Unauthorized)
- ✅ Cannot access chats after logout

**Test Command**:
```javascript
// Save token before logout, then try after
fetch('http://localhost:3000/api/chats/chats', {
  headers: {
    'Authorization': 'Bearer <OLD_TOKEN>'
  }
}).then(r => r.json()).then(console.log);
```

---

## Test Suite 6: Delete Operations

### Test 6.1: Chat Deletion Authorization
**Objective**: Prevent users from deleting others' chats

**Steps**:
1. Login as **User A**, create chat, note chat ID
2. Logout
3. Login as **User B**
4. Try to delete User A's chat via API

**API Test**:
```javascript
fetch('http://localhost:3000/api/chats/chat/65f1a2b3c4d5e6f7g8h9i0j1', {
  method: 'DELETE',
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

**Expected Result**:
- ✅ HTTP 404 Not Found (or 403 Forbidden)
- ✅ Chat NOT deleted from database

---

## Success Criteria

**All tests must pass**:
- ✅ Users NEVER see other users' chats
- ✅ Direct ID access blocked (403/404)
- ✅ Redux state cleared on logout
- ✅ File uploads isolated per user
- ✅ RAG queries don't cross user boundaries
- ✅ Messages remain private
- ✅ Delete operations require ownership

---

## Debugging Tips

### If Tests Fail:

1. **Check Backend Logs**:
   ```bash
   # Look for userId in queries
   console.log("userId:", req.user.id);
   console.log("chat query:", { _id: chatId, user: userId });
   ```

2. **Inspect MongoDB Queries**:
   ```javascript
   // Enable mongoose debug mode
   mongoose.set('debug', true);
   ```
   Verify all queries include `{ user: userId }`

3. **Check Redux State**:
   - Install Redux DevTools extension
   - Monitor state changes during logout
   - Verify `resetChatState` action dispatches

4. **Verify Authentication**:
   - Check cookies are set correctly
   - Verify JWT token contains correct user ID
   - Ensure `req.user.id` matches logged-in user

---

## Automated Test Script (Optional)

Create a simple Node.js script to test API endpoints:

```javascript
// test-isolation.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function testIsolation() {
  // Login as User A
  const userAResponse = await axios.post(`${API_BASE}/auth/login`, {
    email: 'usera@test.com',
    password: 'password123'
  }, { withCredentials: true });
  
  const userAChats = await axios.get(`${API_BASE}/chats/chats`, {
    withCredentials: true
  });
  
  console.log('User A chats:', userAChats.data.chats.length);
  
  // Logout User A
  await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
  
  // Login as User B
  const userBResponse = await axios.post(`${API_BASE}/auth/login`, {
    email: 'userb@test.com',
    password: 'password123'
  }, { withCredentials: true });
  
  const userBChats = await axios.get(`${API_BASE}/chats/chats`, {
    withCredentials: true
  });
  
  console.log('User B chats:', userBChats.data.chats.length);
  
  // Verify isolation
  if (userBChats.data.chats.length === 0) {
    console.log('✅ ISOLATION TEST PASSED');
  } else {
    console.log('❌ ISOLATION TEST FAILED');
  }
}

testIsolation();
```

---

**Testing Status**: Ready for QA  
**Priority**: Critical Security Fix  
**Last Updated**: March 30, 2026
