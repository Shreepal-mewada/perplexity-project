// import { initializeSocketConnection } from "../service/chat.socket";
// import {
//   sendMessage,
//   getChats,
//   getMessages,
//   deleteChat,
// } from "../service/chat.api";
// import { useDispatch } from "react-redux";
// import {
//   setChats,
//   setCurrentChatId,
//   setError,
//   setLoading,
//   createNewChat,
//   addNewMessage,
//   addMessages,
// } from "../chat.slice";

// export const useChat = () => {
//   const dispatch = useDispatch();

//   const handleSendMessage = async ({ message, chatId }) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await sendMessage({ message, chatId });

//       dispatch(setLoading(false));
//       return response;
//     } catch (error) {
//       dispatch(setError(error.message || "Failed to send message"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return {
//     initializeSocketConnection,
//     handleSendMessage,
//   };
// };

import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages } from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      // Step 1: If new chat, create empty chat first
      let finalChatId = chatId;
      if (!chatId) {
        // Create a temporary chat and get its ID from the response
        const tempChatData = await sendMessage({ message, chatId: null });
        finalChatId = tempChatData.chat._id;

        // Create the chat in Redux
        dispatch(
          createNewChat({
            chatId: finalChatId,
            title: tempChatData.chat.title,
          }),
        );

        // Add user message immediately (optimistic update)
        dispatch(
          addNewMessage({
            chatId: finalChatId,
            content: message,
            role: "user",
          }),
        );

        // Add AI message immediately
        dispatch(
          addNewMessage({
            chatId: finalChatId,
            content: tempChatData.aiMessage.content,
            role: tempChatData.aiMessage.role,
          }),
        );

        // Set current chat
        dispatch(setCurrentChatId(finalChatId));
        dispatch(setLoading(false));
        return;
      }

      // Step 2: For existing chat - optimistic update
      dispatch(setLoading(true));

      // Add user message immediately (optimistic update) - appears right away
      dispatch(
        addNewMessage({
          chatId: finalChatId,
          content: message,
          role: "user",
        }),
      );

      // Step 3: Send message to backend
      const data = await sendMessage({ message, chatId: finalChatId });
      const { aiMessage } = data;

      // Step 4: Add AI response when it arrives
      dispatch(
        addNewMessage({
          chatId: finalChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
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
          }, {}),
        ),
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
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      dispatch(setError(error.message || "Failed to load messages"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
  };
};
