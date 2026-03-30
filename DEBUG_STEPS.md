# 🔍 Debug Instructions - Chat Isolation Issue

## Step-by-Step Debugging Process

### Step 1: Start Backend with Logging
```bash
cd Backend
npm run dev
```

Watch the console output carefully.

---

### Step 2: Test with Two Different Users

#### **User A - First Session:**

1. Open your browser (Chrome/Edge)
2. Go to `http://localhost:5173`
3. Register/Login as **User A**
4. Create a test chat with message "Hello from User A"
5. **Check backend console logs** - Look for:
   ```
   [Auth Middleware] Cookie token exists: true
   [Auth Middleware] Decoded JWT: {"id":"65f1a2b3c4d5e6f7g8h9i0j1","iat":...}
   [getChats] Authenticated userId: 65f1a2b3c4d5e6f7g8h9i0j1
   [getChats] Found X chats for user 65f1a2b3c4d5e6f7g8h9i0j1
   ```

6. **Copy the User A ID** from the logs

---

#### **User B - Second Session (INCOGNITO):**

1. Open a NEW **Incognito/Private** window
2. Go to `http://localhost:5173`
3. Register/Login as **User B** (DIFFERENT account)
4. **Check backend console logs** - Look for:
   ```
   [Auth Middleware] Cookie token exists: true
   [Auth Middleware] Decoded JWT: {"id":"DIFFERENT_ID_HERE","iat":...}
   [getChats] Authenticated userId: DIFFERENT_ID_HERE
   [getChats] Found 0 chats for user DIFFERENT_ID_HERE
   ```

5. **Copy the User B ID** from the logs

---

### Step 3: Analyze the Logs

#### ✅ **Expected Behavior (Correct):**
```
=== User A Logs ===
[Auth Middleware] Decoded JWT: {"id":"65f1a2b3c4d5e6f7g8h9i0j1",...}
[getChats] Authenticated userId: 65f1a2b3c4d5e6f7g8h9i0j1
[getChats] Found 1 chats for user 65f1a2b3c4d5e6f7g8h9i0j1

=== User B Logs ===
[Auth Middleware] Decoded JWT: {"id":"75g2b3c4d5e6f7g8h9i0j2k3",...}
[getChats] Authenticated userId: 75g2b3c4d5e6f7g8h9i0j2k3
[getChats] Found 0 chats for user 75g2b3c4d5e6f7g8h9i0j2k3
```

**Different user IDs = GOOD** ✅

---

#### ❌ **Problem Scenario 1: Same User ID**
```
=== User A Logs ===
[getChats] Authenticated userId: 65f1a2b3c4d5e6f7g8h9i0j1

=== User B Logs ===
[getChats] Authenticated userId: 65f1a2b3c4d5e6f7g8h9i0j1  ← SAME ID!
```

**Cause:** Both users sharing same cookie/token  
**Solution:** Clear cookies, ensure proper logout

---

#### ❌ **Problem Scenario 2: userId is undefined**
```
[getChats] Authenticated userId: undefined
```

**Cause:** JWT payload doesn't have `id` field  
**Solution:** Check login endpoint returns correct token structure

---

#### ❌ **Problem Scenario 3: Wrong field name**
```
[Auth Middleware] Decoded JWT: {"_id":"65f1a2b3c4d5e6f7g8h9i0j1",...}
[getChats] Authenticated userId: undefined
```

**Cause:** Token uses `_id` but code expects `id`  
**Solution:** Change `req.user.id` to `req.user._id` in controllers

---

### Step 4: Database Verification

If logs show different user IDs but still seeing cross-user chats, check MongoDB directly:

```javascript
// Connect to MongoDB and run these queries:

// Check User A's chats
db.chats.find({ user: ObjectId("65f1a2b3c4d5e6f7g8h9i0j1") })

// Check User B's chats  
db.chats.find({ user: ObjectId("75g2b3c4d5e6f7g8h9i0j2k3") })

// Check ALL chats to see user distribution
db.chats.find().forEach(chat => {
  print(`Chat: ${chat.title}, User: ${chat.user}`);
})
```

---

### Step 5: Frontend Cookie Inspection

1. In each browser window, open DevTools (F12)
2. Go to **Application** tab → **Cookies** → `http://localhost:5173`
3. Look for `token` and `refreshToken` cookies

**Verify:**
- ✅ User A and User B have DIFFERENT cookie values
- ✅ Cookies are being sent with requests
- ✅ No JavaScript errors in Console

---

## Common Issues & Solutions

### Issue 1: Using Same Browser Window
**Problem:** Opening both users in same browser without clearing cookies  
**Solution:** Use Incognito mode OR clear cookies between logins

---

### Issue 2: Frontend Not Sending Cookies
**Problem:** Axios not configured with `withCredentials: true`  
**Check:** Frontend API calls should include:
```javascript
axios.get('/api/chats', { withCredentials: true });
```

---

### Issue 3: Token Structure Mismatch
**Problem:** JWT payload field name doesn't match code expectation

**Check Login Controller (line 65, 80):**
```javascript
const refreshToken = jwt.sign({ id: user._id }, ...); // Should be 'id'
const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, ...);
```

**Fix if needed:**
```javascript
// If using _id instead:
const refreshToken = jwt.sign({ _id: user._id }, ...);

// Then update auth middleware:
req.user = decoded;
req.user.id = decoded._id; // Add alias
```

---

### Issue 4: MongoDB ObjectId Type Mismatch
**Problem:** Comparing string to ObjectId incorrectly

**Current code handles this:**
```javascript
if (!activeChatDoc || activeChatDoc.user.toString() !== userId.toString()) {
```

This converts both to strings before comparison ✅

---

### Issue 5: Cache/Stale Redux State
**Problem:** Frontend showing old user's chats from Redux store

**Solution:** Already fixed with `resetChatState()` on logout ✅

---

## Quick Diagnostic Commands

### Backend Console - Enable Verbose Logging:
Add to `app.js`:
```javascript
mongoose.set('debug', true);
```

This will show all MongoDB queries with their parameters.

---

### Frontend Console - Check Current User:
Paste in browser console:
```javascript
// Check Redux state
console.log('Current user:', store.getState().auth.user);
console.log('Current chats:', Object.keys(store.getState().chat.chats));
```

---

### Direct API Test:
```bash
# Get current user's chats
curl http://localhost:3000/api/chats/chats \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  | jq
```

---

## Expected Results Summary

| Check | Expected Value | If Different |
|-------|---------------|--------------|
| User A ID | `65f1a2...` | - |
| User B ID | `75g2b3...` (different) | Cookie/token issue |
| User A chats | Shows User A's data | Query issue |
| User B chats | Empty or User B's data | Isolation working ✅ |
| MongoDB user field | ObjectId type | Type mismatch |
| Cookie values | Different per user | Cookie sharing issue |

---

## Next Steps After Diagnostics

Once you identify the issue from the logs:

1. **Same userId for both users** → Cookie/authentication issue
2. **Different userIds but seeing other's chats** → Database query issue  
3. **userId is undefined** → JWT structure issue
4. **Logs look correct but UI wrong** → Frontend state issue

**Please run these steps and share the console logs so I can pinpoint the exact issue!**
