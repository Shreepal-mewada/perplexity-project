import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, sendImageMessage, getChats, getMessages, deleteChat, createChat } from "../service/chat.api";
import { uploadFile, removeFile } from "../service/file.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  updateChat,
  addNewMessage,
  addMessages,
  removeChat,
  setFileContext,
  clearFileContext,
  updateMessage,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

const getStore = () => window.__REDUX_STORE__;

export const useChat = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { fileContext } = state.chat;

  async function handleSendMessage({ message, chatId }) {
    try {
      let finalChatId = chatId;
      if (!chatId) {
        const tempChatId = `temp-${Date.now()}`;
        dispatch(createNewChat({ chatId: tempChatId, title: "New Chat" }));
        dispatch(addNewMessage({ chatId: tempChatId, content: message, role: "user" }));
        dispatch(setCurrentChatId(tempChatId));
        dispatch(setLoading(true));

        const response = await sendMessage({
          message,
          chatId: null,
          fileId: fileContext?.fileId || null,
        });

        finalChatId = response.chat._id;
        dispatch(updateChat({ oldChatId: tempChatId, newChatId: finalChatId, title: response.chat.title }));
        dispatch(addNewMessage({ chatId: finalChatId, content: response.aiMessage.content, role: response.aiMessage.role, isNewReply: true }));
        dispatch(setLoading(false));
        return;
      }

      dispatch(setLoading(true));
      dispatch(addNewMessage({ chatId: finalChatId, content: message, role: "user" }));

      const data = await sendMessage({
        message,
        chatId: finalChatId,
        fileId: fileContext?.fileId || null,
      });

      dispatch(addNewMessage({ chatId: finalChatId, content: data.aiMessage.content, role: data.aiMessage.role, isNewReply: true }));
    } catch (error) {
      dispatch(setError(error.message || "Failed to send message"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {})
        )
      );
    } catch (error) {
      dispatch(setError(error.message || "Failed to load chats"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId) {
    try {
      dispatch(setLoading(true));
      const data = await getMessages(chatId);
      const { messages, fileContext: restoredFileContext } = data;

      const normalized = messages.map((msg) => {
        const base = {
          _id: msg._id,
          content: msg.content || "",
          role: msg.role,
          type: msg.type || "text",
        };
        if (msg.type === "image" && msg.imageInfo) {
          base.fileName = msg.imageInfo.fileName;
          base.url = msg.imageInfo.data || msg.imageInfo.url || "";
        }
        if (msg.type === "file" && msg.fileInfo) {
          base.fileName = msg.fileInfo.fileName;
          base.fileId = msg.fileInfo.fileId;
        }
        return base;
      });

      dispatch(addMessages({ chatId, messages: normalized }));
      dispatch(setCurrentChatId(chatId));

      dispatch(clearFileContext());
    } catch (error) {
      dispatch(setError(error.message || "Failed to load messages"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(clearFileContext());
  }

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setLoading(true));
      await deleteChat({ chatId });
      dispatch(removeChat(chatId));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete chat"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * handleSendWithFile — ChatGPT-style combined send.
   *
   * Called when user clicks Send with a pending file staged in the InputBar.
   * Flow:
   *   1. If no chat exists → silently create one (POST /api/chats/create)
   *   2. Upload + index the file (uploading → parsing → ready)
   *   3. Dispatch a type:"file" user message so the PDF card appears in chat
   *   4. If the user also typed a message → send it with the fileId attached
   *   5. Returns true on success / false on error
   *      (InputBar uses return value to decide whether to clear or keep the file)
   */
  async function handleSendWithFile({ message, file, chatId }) {
    if (!file) return false;

    let activeChatId = chatId;

    // Step 1: Silently create chat if none exists
    if (!activeChatId) {
      try {
        dispatch(setFileContext({ fileName: file.name, status: "uploading" }));
        const created = await createChat({ title: file.name.replace(/\.pdf$/i, "") || "New Chat" });
        activeChatId = created.chat._id;
        dispatch(createNewChat({ chatId: activeChatId, title: created.chat.title }));
        dispatch(setCurrentChatId(activeChatId));
      } catch (err) {
        dispatch(setFileContext({ fileName: file.name, status: "failed", errorMessage: "Could not start chat." }));
        return false;
      }
    }

    // Step 2: Upload + index the file
    try {
      dispatch(setFileContext({ fileName: file.name, status: "uploading" }));
      dispatch(setFileContext({ fileName: file.name, status: "parsing" }));

      const result = await uploadFile(file, activeChatId);

      // Track index BEFORE dispatching
      const store = getStore();
      const msgsBefore = store.getState().chat.chats[activeChatId]?.messages || [];
      const optimisticFileIndex = msgsBefore.length;

      // Step 3: Add PDF card to chat (optimistic, will be updated with server data below)
      dispatch(addNewMessage({
        chatId: activeChatId,
        content: message?.trim() || "",
        role: "user",
        type: "file",
        fileName: result.fileName,
        fileId: result.fileId,
      }));

      // Update optimistic file message with server-persisted data
      if (result.fileMessage) {
        dispatch(updateMessage({
          chatId: activeChatId,
          index: optimisticFileIndex,
          updates: {
            fileName: result.fileMessage.fileInfo?.fileName || result.fileName,
            fileId: result.fileMessage.fileInfo?.fileId || result.fileId,
          },
        }));
      }

      // Clear file context from the input bar natively now that it's sent and linked to chat.
      dispatch(clearFileContext());

      // Step 4: Call backend AI directly if there's text (skips dispatching duplicate user bubble)
      if (message?.trim()) {
        try {
          dispatch(setLoading(true));
          const data = await sendMessage({
            message: message.trim(),
            chatId: activeChatId,
            fileId: result.fileId,
          });
          dispatch(addNewMessage({
            chatId: activeChatId,
            content: data.aiMessage.content,
            role: data.aiMessage.role,
            isNewReply: true
          }));
        } catch (msgErr) {
          dispatch(setError(msgErr.message || "Failed to send message"));
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        // If no text was sent, use AI greeting from server response
        if (result.aiMessage) {
          dispatch(addNewMessage({
            chatId: activeChatId,
            content: result.aiMessage.content,
            role: result.aiMessage.role,
            isNewReply: true
          }));
        }
      }

      return true; // → InputBar clears the pending file from input
    } catch (err) {
      const errorMsg = err?.message || "File upload failed. Please try again.";
      dispatch(setFileContext({ fileName: file.name, status: "failed", errorMessage: errorMsg }));
      return false; // → InputBar keeps the file in input
    }
  }

  async function handleSendWithImage({ message, file, chatId }) {
    if (!file) return false;

    let activeChatId = chatId;

    // Step 1: Create chat if none exists
    if (!activeChatId) {
      try {
        const created = await createChat({ title: file.name || "Image Chat" });
        activeChatId = created.chat._id;
        dispatch(createNewChat({ chatId: activeChatId, title: created.chat.title }));
        dispatch(setCurrentChatId(activeChatId));
      } catch (err) {
        dispatch(setError("Could not start chat for image."));
        return false;
      }
    }

    // Step 2: Track index BEFORE dispatching so we know exactly where the message will go
    const store = getStore();
    const messagesBefore = store.getState().chat.chats[activeChatId]?.messages || [];
    const optimisticIndex = messagesBefore.length;

    // Create a data URL from the file for instant preview (no blob URL needed)
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    dispatch(addNewMessage({
      chatId: activeChatId,
      content: message?.trim() || "",
      role: "user",
      type: "image",
      fileName: file.name,
      url: dataUrl,
    }));

    dispatch(setLoading(true));

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (message?.trim()) formData.append("message", message.trim());
      formData.append("chatId", activeChatId);

      const response = await sendImageMessage(formData);

      // Update optimistic message using the tracked index
      const serverData = response.userMessage.imageInfo?.data || dataUrl;
      const serverFileName = response.userMessage.imageInfo?.fileName || file.name;
      dispatch(updateMessage({
        chatId: activeChatId,
        index: optimisticIndex,
        updates: {
          content: response.userMessage.content || "",
          url: serverData,
          fileName: serverFileName,
        },
      }));

      // Add AI response
      dispatch(addNewMessage({
        chatId: activeChatId,
        content: response.aiMessage.content,
        role: response.aiMessage.role,
        isNewReply: true
      }));

      return true;
    } catch (err) {
      dispatch(setError(err.message || "Image processing failed."));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  /**
   * Removes the active file context and deletes vectors from Pinecone.
   */
  async function handleClearFile() {
    const currentFileId = fileContext?.fileId;
    dispatch(clearFileContext());

    if (currentFileId) {
      try {
        await removeFile(currentFileId);
      } catch (err) {
        console.error("Failed to remove file from Pinecone:", err);
      }
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
    handleDeleteChat,
    handleSendWithFile,
    handleSendWithImage,
    handleClearFile,
  };
};
