// import useGetConversations from "../../hooks/useGetConversations";
// import { getRandomEmoji } from "../../utils/emojis";
// import Conversation from "./Conversation";

// const Conversations = () => {
//   const { loading, conversations } = useGetConversations();
//   console.log("conversations", conversations);
//   return (
//     <div className="py-2 flex flex-col overflow-auto">
//       {conversations.map((conversation, idx) => (
//         <Conversation
//           key={conversation._id}
//           conversation={conversation}
//           emoji={getRandomEmoji()}
//           lastIdx={idx === conversations.length - 1}
//         />
//       ))}

//       {loading ? (
//         <span className="loading loading-spinner mx-auto"></span>
//       ) : null}
//     </div>
//   );
// };
// export default Conversations;
import { useSocketContext } from "../../context/SocketContext";
import useGetConversations from "../../hooks/useGetConversations";
import useGetProfile from "../../hooks/useGetProfile";
import { getRandomEmoji } from "../../utils/emojis";
import useConversation from "../../zustand/useConversation";
import notificationSound from "../../assets/sounds/notification.mp3";

import Conversation from "./Conversation";
import { useEffect, useState } from "react";

const Conversations = () => {
  const { loading, conversations: initialConversations } =
    useGetConversations();
  const { setReArrange, reArrange, messages, setConversations, conversations } =
    useConversation();
  const { getProfile } = useGetProfile();
  // const [conversations, setConversations] = useState(initialConversations);
  const { socket } = useSocketContext();

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("newMessage", (newMessage) => {
  //       console.log("hiii", newMessage);
  //       handleNewMessage(newMessage);
  //     });

  //     return () => {
  //       socket.off("newMessage");
  //     };
  //   }
  // }, [socket, messages, conversations]);

  useEffect(() => {
    if (conversations.length > 0)
      handleSendNewMessage(messages[messages.length - 1]);
  }, [reArrange]);
  // console.log("conversations outside", conversations);

  const handleNewMessage = async (newMessage) => {
    const existingConversation = conversations.find(
      (conv) => conv._id === newMessage.senderId
    );

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
      const sound = new Audio(notificationSound);
      sound.play();
    }
  };

  const handleSendNewMessage = (newMessage) => {
    const isOnTop = conversations[0]._id === newMessage.receiverId;

    if (!isOnTop) {
      // Move the existing conversation to the top
      const updatedConversations = conversations.filter(
        (conv) => conv._id !== newMessage.receiverId
      );
      const currentConversation = conversations.find(
        (conv) => conv._id === newMessage.receiverId
      );
      setConversations([currentConversation, ...updatedConversations]);
    } else {
      // Add a new conversation to the top if it doesn't exist
      setConversations([...conversations]);
    }
  };
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}

      {conversations.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
            <p>No friends yet</p>
            <p>Find friends and start chatting.</p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <span className="loading loading-spinner mx-auto"></span>
      ) : null}
    </div>
  );
};

export default Conversations;
