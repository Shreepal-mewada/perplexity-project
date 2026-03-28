import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
    // Active file context for RAG — restored on chat open
    fileContext: null, // { fileId, fileName, status, errorMessage? }
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    updateChat: (state, action) => {
      const { oldChatId, newChatId, title } = action.payload;
      if (state.chats[oldChatId]) {
        const messages = state.chats[oldChatId].messages;
        delete state.chats[oldChatId];
        state.chats[newChatId] = {
          id: newChatId,
          title,
          messages,
          lastUpdated: new Date().toISOString(),
        };
        // Update currentChatId if it was pointing to the old chat
        if (state.currentChatId === oldChatId) {
          state.currentChatId = newChatId;
        }
      }
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role, isNewReply } = action.payload;
      state.chats[chatId].messages.push({ content, role, isNewReply });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages = messages;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    // RAG file context reducers
    setFileContext: (state, action) => {
      // payload: { fileId, fileName, status, errorMessage? }
      state.fileContext = action.payload;
    },
    clearFileContext: (state) => {
      state.fileContext = null;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  updateChat,
  addNewMessage,
  addMessages,
  removeChat,
  setFileContext,
  clearFileContext,
} = chatSlice.actions;

export default chatSlice.reducer;

