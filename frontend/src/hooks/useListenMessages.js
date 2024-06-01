import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import useGetProfile from "./useGetProfile";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { getProfile } = useGetProfile();
  const {
    messages,
    setMessages,
    selectedConversation,
    setConversations,
    conversations,
  } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("newMessage.senderId ", newMessage.senderId);
      console.log("selectedConversation._id", selectedConversation?._id);
      handleNewMessage(newMessage);
      if (newMessage.senderId === selectedConversation?._id) {
        newMessage.shouldShake = true;
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages, newMessage]);
      } else {
        const sound = new Audio(notificationSound);
        sound.play();
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, messages, conversations]);

  const handleNewMessage = async (newMessage) => {
    const existingConversation = conversations.find(
      (conv) => conv._id === newMessage.senderId
    );
    console.log(existingConversation);
    if (existingConversation) {
      // Move the existing conversation to the top
      const updatedConversations = conversations.filter(
        (conv) => conv._id !== newMessage.senderId
      );
      setConversations([{ ...existingConversation }, ...updatedConversations]);
    } else {
      // Add a new conversation to the top if it doesn't exist
      const user = await getProfile(newMessage.senderId);
      // console.log("user", user);
      // console.log("conversations", conversations);
      setConversations([{ ...user }, ...conversations]);
    }
  };
};
export default useListenMessages;
