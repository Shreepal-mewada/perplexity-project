# 🧪 Backend Health Monitoring - Testing Guide

## Quick Start Testing

### Prerequisites

- Backend server stopped/sleeping
- Frontend dev server running
- Browser DevTools open (Console tab)

---

## Test Scenario 1: Simulate Cold Start ⏰

### Steps:

1. **Stop Backend Server**

   ```bash
   # In backend terminal, press Ctrl+C
   ```

2. **Open Frontend App**

   ```
   http://localhost:5173
   ```

3. **Try to Send a Message**

   - Navigate to chat
   - Type "Hello" in message box
   - Click send

4. **Observe (0-2 seconds)**

   - Nothing visible happens yet
   - Console shows: `[API Retry] Attempt 1/60 failed`

5. **Observe (2+ seconds)**

   - ✅ Popup appears with spinner
   - ✅ Message: "Server is waking up..."
   - ✅ Dots animate (...)
   - Console shows: `[Backend Health] 🔄 Started health polling`

6. **Start Backend Server**

   ```bash
   cd Backend
   npm start
   ```

7. **Wait for Recovery (5-30 seconds)**
   - Backend starts up
   - Health check succeeds
   - ✅ Popup disappears automatically
   - ✅ Original message sends successfully
   - Console shows: `[Backend Health] ✅ Server is back online!`

---

## Test Scenario 2: Auth Flow 🔐

### Steps:

1. **Stop Backend Server**

2. **Try to Login**

   - Navigate to login page
   - Enter credentials
   - Click "Login"

3. **Expected Behavior**
   - Popup appears after 2 seconds
   - System retries every 5 seconds
   - Once backend starts, login succeeds automatically

---

## Test Scenario 3: File Upload 📄

### Steps:

1. **Stop Backend Server**

2. **Create New Chat** (if backend already running)

3. **Upload PDF File**

   - Click attachment icon
   - Select PDF file
   - Click upload

4. **Expected Behavior**
   - Popup appears
   - Upload waits for backend recovery
   - Upload proceeds automatically once server is up

---

## Test Scenario 4: Multiple Requests 🔄

### Steps:

1. **Stop Backend Server**

2. **Trigger Multiple Actions Quickly**

   - Send message
   - Try to load chat history
   - Try to create new chat

3. **Expected Behavior**
   - ✅ Only ONE health check runs
   - ✅ Single popup shown (not multiple)
   - ✅ All requests queue and retry together
   - ✅ All succeed when backend recovers

---

## Test Scenario 5: Mobile Responsiveness 📱

### Steps:

1. **Open Chrome DevTools**

   - Press `F12` or `Ctrl+Shift+I`
   - Click device toggle icon
   - Select mobile device (e.g., iPhone 12)

2. **Trigger Backend Downtime**

   - Stop backend server
   - Send message

3. **Expected on Mobile**
   - ✅ Top banner notification appears
   - ✅ Centered popup also shown
   - ✅ Both have smooth animations
   - ✅ Text is readable
   - ✅ No overflow issues

---

## Console Log Verification

### What You Should See

**When Backend Goes Down:**

```
[API Retry] Attempt 1/60 failed
[Backend Health] 🔄 Started health polling
[Backend Health] ⏳ Still waiting... (Attempt 1/60)
```

**Every 5 Seconds:**

```
[Backend Health] ⏳ Still waiting... (Attempt 2/60)
[Backend Health] ⏳ Still waiting... (Attempt 3/60)
...
```

**When Backend Recovers:**

```
[Backend Health] ✅ Server is back online!
[Backend Health] ⏹️ Stopped health polling
[Backend Health] ✅ Pending request succeeded
```

---

## Visual Verification Checklist

### Popup Appearance

- [ ] Smooth fade-in animation (300ms)
- [ ] Centered on screen
- [ ] Glass morphism effect
- [ ] Spinner rotating smoothly
- [ ] Lightning bolt icon visible
- [ ] Text readable
- [ ] Dots animating ("...")

### Backdrop

- [ ] Semi-transparent black overlay
- [ ] Covers entire viewport
- [ ] Blur effect applied
- [ ] Doesn't block interaction completely

### Mobile Banner

- [ ] Appears at top of screen
- [ ] Blue background (primary color)
- [ ] White text
- [ ] Spinning icon
- [ ] Proper padding
- [ ] No text overflow

### Recovery

- [ ] Popup fades out smoothly
- [ ] Banner slides up
- [ ] Returns to normal UI
- [ ] No stuck elements

---

## Performance Testing

### Measure Recovery Time

1. **Start Timer** when you stop backend
2. **Send Message** (popup appears)
3. **Start Backend** immediately
4. **Stop Timer** when popup disappears

**Expected Times:**

- Local development: 5-15 seconds
- Render free tier: 15-30 seconds
- Other hosting: 10-20 seconds

---

## Edge Case Testing

### Edge Case 1: Very Slow Server (>5 minutes)

**Test:**

1. Stop backend
2. Don't start it for 6+ minutes
3. Watch console logs

**Expected:**

- Retries stop after 60 attempts (5 minutes)
- Error shown: "Max retries reached"
- Popup remains (or shows error state)

### Edge Case 2: Network Disconnect

**Test:**

1. Disable WiFi/network in browser DevTools
2. Send message

**Expected:**

- Same behavior as backend down
- Popup appears
- Retries continue
- User informed about network issue

### Edge Case 3: Auth Error During Downtime

**Test:**

1. Stop backend
2. Let token expire while waiting
3. Start backend

**Expected:**

- Health check succeeds
- Original request fails with auth error
- Redirect to login page
- Normal auth flow resumes

---

## Browser Compatibility Testing

Test in these browsers:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

**All should show:**

- Same popup design
- Smooth animations
- Proper error handling
- Consistent timing

---

## Integration Point Testing

### Chat Features

- [ ] Send text message
- [ ] Send image message
- [ ] Load chat history
- [ ] Create new chat
- [ ] Delete chat
- [ ] Upload PDF

### Auth Features

- [ ] Register new user
- [ ] Login existing user
- [ ] Refresh token
- [ ] Get user profile
- [ ] Logout

### File Features

- [ ] Upload file
- [ ] Remove file
- [ ] View file context

**All should trigger health monitoring on failure.**

---

## Configuration Testing

### Test Different Delays

Edit `backendHealth.service.js`:

```javascript
// Test immediate popup
SHOW_DELAY: 0;

// Test longer delay
SHOW_DELAY: 5000;

// Test faster retries
RETRY_INTERVAL: 2000;

// Test slower retries
RETRY_INTERVAL: 10000;
```

Verify changes work as expected.

---

## Cleanup Testing

### Test State Reset

1. **Logout While Backend Down**

   - Trigger popup
   - Click logout
   - Popup should disappear
   - State should reset

2. **Refresh Page**
   - Popup visible
   - Hard refresh (F5)
   - Popup gone (state cleared)

---

## Production Readiness Checklist

### Functionality

- [x] Detects backend downtime
- [x] Shows professional popup
- [x] Auto-retries every 5 seconds
- [x] Recovers automatically
- [x] Works across all features

### UX Quality

- [x] Smooth animations
- [x] Clear messaging
- [x] Mobile responsive
- [x] No harsh blocking

### Performance

- [x] Minimal bundle size
- [x] Efficient polling
- [x] Low memory usage

### Code Quality

- [x] No syntax errors
- [x] Clean code structure
- [x] Well documented
- [x] TypeScript-ready

### Accessibility

- [x] Keyboard navigation works
- [x] Screen reader friendly
- [x] Color contrast sufficient
- [x] Focus management

---

## Debugging Tips

### If Popup Doesn't Show

1. Check console for errors
2. Verify `isNetworkError` detection
3. Confirm `subscribeToBackendStatus` called
4. Check component mounted correctly

### If Popup Doesn't Hide

1. Check `/health` endpoint responds
2. Verify CORS configuration
3. Confirm health check timeout not too short
4. Check console for success logs

### If Retries Don't Start

1. Check `startHealthPolling` called
2. Verify interval timer created
3. Confirm no JavaScript errors
4. Check MAX_RETRIES not exceeded

---

## Success Criteria

✅ **All Tests Pass When:**

- Popup appears within 2 seconds of backend failure
- Recovery happens automatically within 30 seconds
- No manual page refresh needed
- All API calls succeed after recovery
- Mobile UI looks polished
- Console logs show clean flow

🎉 **You're Ready for Production!**

---

## Next Steps After Testing

1. **Deploy to Production**

   ```bash
   cd Frontend
   npm run build
   # Deploy to Vercel/hosting
   ```

2. **Monitor Real Usage**

   - Add analytics tracking
   - Monitor retry frequency
   - Track average recovery time

3. **Gather User Feedback**

   - Ask users about experience
   - Check support tickets
   - Monitor social media mentions

4. **Iterate if Needed**
   - Adjust timing based on data
   - Refine messaging
   - Optimize performance

---

**Happy Testing! 🚀**
