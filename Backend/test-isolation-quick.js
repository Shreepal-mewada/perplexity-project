/**
 * Quick Isolation Test Script
 *
 * This script tests if chat isolation is working by simulating two users
 *
 * Usage:
 * 1. Start backend server first
 * 2. Run: node test-isolation-quick.js
 */

import axios from "axios";

const API_BASE = "http://localhost:3000/api";

// Test user credentials (create these accounts first)
const USER_A = {
  email: "testa@example.com",
  password: "test123",
};

const USER_B = {
  email: "testb@example.com",
  password: "test123",
};

async function login(email, password) {
  try {
    const response = await axios.post(
      `${API_BASE}/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    return {
      success: true,
      userId: response.data.user.id,
      token: response.data.accessToken,
      cookies: response.headers["set-cookie"],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function getChats(token) {
  try {
    const response = await axios.get(`${API_BASE}/chats/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      chats: response.data.chats,
      count: response.data.chats.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function createChat(token, title = "Test Chat") {
  try {
    const response = await axios.post(
      `${API_BASE}/chats/create`,
      {
        title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      chatId: response.data.chat._id,
      title: response.data.chat.title,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function sendMessage(token, chatId, message) {
  try {
    const response = await axios.post(
      `${API_BASE}/chats/message`,
      {
        chatId,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      aiMessage: response.data.aiMessage.content.substring(0, 50) + "...",
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function runIsolationTest() {
  console.log("\n🧪 STARTING CHAT ISOLATION TEST\n");
  console.log("=".repeat(50));

  // Step 1: Login User A
  console.log("\n📝 Step 1: Logging in as User A...");
  const loginA = await login(USER_A.email, USER_A.password);

  if (!loginA.success) {
    console.log("❌ User A login failed:", loginA.error);
    console.log("\n💡 Create account testa@example.com first!");
    return;
  }

  console.log("✅ User A logged in successfully");
  console.log(`   User ID: ${loginA.userId}`);

  // Step 2: Get User A's chats
  console.log("\n📝 Step 2: Fetching User A chats...");
  const chatsA = await getChats(loginA.token);

  if (!chatsA.success) {
    console.log("❌ Failed to get User A chats:", chatsA.error);
    return;
  }

  console.log(`✅ User A has ${chatsA.count} chat(s)`);
  chatsA.chats.forEach((chat) => {
    console.log(`   - ${chat.title}`);
  });

  // Step 3: Create a new chat for User A
  console.log("\n📝 Step 3: Creating new chat for User A...");
  const newChat = await createChat(loginA.token, "User A Private Chat");

  if (!newChat.success) {
    console.log("❌ Failed to create chat:", newChat.error);
    return;
  }

  console.log("✅ Chat created successfully");
  console.log(`   Chat ID: ${newChat.chatId}`);
  console.log(`   Title: ${newChat.title}`);

  // Step 4: Send a message in User A's chat
  console.log("\n📝 Step 4: Sending message in User A chat...");
  const msgResult = await sendMessage(
    loginA.token,
    newChat.chatId,
    "This is a secret message from User A"
  );

  if (!msgResult.success) {
    console.log("❌ Failed to send message:", msgResult.error);
    return;
  }

  console.log("✅ Message sent successfully");
  console.log(`   AI Response: ${msgResult.aiMessage}`);

  // Step 5: Login User B
  console.log("\n📝 Step 5: Logging in as User B...");
  const loginB = await login(USER_B.email, USER_B.password);

  if (!loginB.success) {
    console.log("❌ User B login failed:", loginB.error);
    console.log("\n💡 Create account testb@example.com first!");
    return;
  }

  console.log("✅ User B logged in successfully");
  console.log(`   User ID: ${loginB.userId}`);

  // Step 6: Get User B's chats (SHOULD BE EMPTY)
  console.log("\n📝 Step 6: Fetching User B chats (should be empty)...");
  const chatsB = await getChats(loginB.token);

  if (!chatsB.success) {
    console.log("❌ Failed to get User B chats:", chatsB.error);
    return;
  }

  console.log(`✅ User B has ${chatsB.count} chat(s)`);

  if (chatsB.count > 0) {
    console.log("\n🚨 SECURITY ISSUE DETECTED! 🚨");
    console.log("User B can see chats but should have NONE!");
    chatsB.chats.forEach((chat) => {
      console.log(`   - ${chat.title} (ID: ${chat._id})`);
    });

    // Check if User B can see User A's private chat
    const canSeeUserAChat = chatsB.chats.some((c) => c._id === newChat.chatId);
    if (canSeeUserAChat) {
      console.log("\n❌ CRITICAL: User B can see User A's chat!");
    } else {
      console.log(
        "\n⚠️  User B has chats but not User A's (might be test data)"
      );
    }
  } else {
    console.log("✅ ISOLATION WORKING: User B has no chats");
  }

  // Step 7: Try to access User A's chat directly
  console.log("\n📝 Step 7: Testing direct chat access control...");
  try {
    const accessTest = await axios.get(
      `${API_BASE}/chats/messages/${newChat.chatId}`,
      {
        headers: {
          Authorization: `Bearer ${loginB.token}`,
        },
      }
    );

    console.log("🚨 SECURITY BREACH! User B accessed User A's chat!");
    console.log("Messages retrieved:", accessTest.data.messages.length);
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      console.log("✅ ACCESS DENIED: User B cannot access User A's chat");
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(
        "⚠️  Unexpected error:",
        error.response?.data?.message || error.message
      );
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  console.log(`User A ID: ${loginA.userId}`);
  console.log(`User B ID: ${loginB.userId}`);
  console.log(`User A chats: ${chatsA.count}`);
  console.log(`User B chats: ${chatsB.count}`);
  console.log(`New chat created: ${newChat.chatId}`);

  const isolationWorking =
    chatsB.count === 0 || !chatsB.chats.some((c) => c._id === newChat.chatId);

  if (isolationWorking) {
    console.log("\n✅ CHAT ISOLATION: WORKING");
  } else {
    console.log("\n❌ CHAT ISOLATION: FAILED");
  }

  console.log("=".repeat(50) + "\n");
}

// Run the test
runIsolationTest().catch(console.error);
