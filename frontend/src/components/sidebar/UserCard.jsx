import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const UserCard = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { setReArrange, reArrange, messages, setConversations, conversations } =
    useConversation();
  return (
    <>
      <div
        className={`w-80 flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
			}
			`}
        onClick={() => {
          const isExist = conversations.find(
            (item) => item._id === conversation._id
          );
          if (isExist) {
            setSelectedConversation(conversation);
          } else {
            setConversations([conversation, ...conversations]);
            setSelectedConversation(conversation);
          }
        }}
      >
        <div className={`avatar`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
            {/* <span className="text-xl">{emoji}</span> */}
          </div>
        </div>
      </div>

      {!lastIdx && (
        <div className="flex justify-center items-center">
          <div className="divider my-0 py-0 h-1 w-80" />
        </div>
      )}
    </>
  );
};
export default UserCard;
