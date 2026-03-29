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
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const { fileContext } = useSelector((state) => state.chat);

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

      dispatch(addMessages({ chatId, messages: messages.map((msg) => ({ content: msg.content, role: msg.role })) }));
      dispatch(setCurrentChatId(chatId));

      // Chat history dictates the file context natively on the backend,
      // so we don't pin it to the input bar.
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

      // Step 3: Add PDF card and text to chat as a single user message
      dispatch(addNewMessage({
        chatId: activeChatId,
        content: message?.trim() || "",
        role: "user",
        type: "file",
        fileName: result.fileName,
        fileId: result.fileId,
      }));

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
        // If no text was sent, provide an AI greeting to guide the user
        setTimeout(() => {
          dispatch(addNewMessage({
            chatId: activeChatId,
            content: `I've read through **${result.fileName}**. What would you like to ask about this document?`,
            role: "ai",
            isNewReply: true
          }));
        }, 600);
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

    // Step 2: Optimistic UI – Add Image User Message
    const optimisticMessageId = `opt-${Date.now()}`;
    const temporaryUrl = URL.createObjectURL(file);
    dispatch(addNewMessage({
      chatId: activeChatId,
      id: optimisticMessageId,
      content: message?.trim() || "",
      role: "user",
      type: "image",
      fileName: file.name,
      url: temporaryUrl,
    }));

    dispatch(setLoading(true));

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (message?.trim()) formData.append("message", message.trim());
      formData.append("chatId", activeChatId);

      const response = await sendImageMessage(formData);

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
      URL.revokeObjectURL(temporaryUrl);
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
