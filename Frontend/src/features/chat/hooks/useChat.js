import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
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

      // Restore file context if the chat had an active file
      if (restoredFileContext?.fileId) {
        dispatch(setFileContext({ ...restoredFileContext, status: "ready" }));
      } else {
        dispatch(clearFileContext());
      }
    } catch (error) {
      dispatch(setError(error.message || "Failed to load messages"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(clearFileContext()); // Clear file context on new chat
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
   * Handles file upload — processes PDF through backend RAG pipeline.
   * Updates Redux fileContext through all indexing states.
   */
  async function handleUploadFile(file, chatId) {
    if (!file || !chatId) return;

    // Show uploading state immediately
    dispatch(setFileContext({ fileName: file.name, status: "uploading" }));

    try {
      // Simulate intermediate states for UX (backend handles all states synchronously)
      dispatch(setFileContext({ fileName: file.name, status: "parsing" }));

      const result = await uploadFile(file, chatId);

      // Mark as ready with full metadata
      dispatch(setFileContext({
        fileId: result.fileId,
        fileName: result.fileName,
        status: "ready",
      }));
    } catch (err) {
      const message = err?.message || "File upload failed. Please try again.";
      dispatch(setFileContext({
        fileName: file.name,
        status: "failed",
        errorMessage: message,
      }));
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
        // Non-fatal — context already cleared on frontend
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
    handleUploadFile,
    handleClearFile,
  };
};

