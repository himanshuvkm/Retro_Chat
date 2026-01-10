import { useSocketContext } from "../../context/socketContext";
import useConverstation from "../../zustand/useconversation";
import { Users } from "lucide-react";

const Conversation = ({ conversation, lastidx }) => {
  const { onlineUsers } = useSocketContext();
  const { selectedConversation, setSelectedConversation } = useConverstation();

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-3 items-center px-4 py-3 cursor-pointer transition-all border-b border-transparent hover:bg-white/50 m-1 rounded-lg ${isSelected ? "bg-[var(--accent-lavender)] shadow-sm border-[var(--window-border)] border-b-2" : ""
          }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="relative flex-shrink-0">
          <div className={`w-11 h-11 transition-all rounded-full border-2 ${isSelected ? 'border-[var(--accent-peach)]' : 'border-white'} shadow-sm overflow-hidden bg-white flex items-center justify-center`}>
            {conversation.isGroup ? (
              <div className="bg-[var(--accent-mint)] w-full h-full flex items-center justify-center text-[var(--text-main)]">
                <Users size={20} />
              </div>
            ) : (
              <img src={conversation.profilePic} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          {isOnline && !conversation.isGroup && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--accent-mint)] border-2 border-white rounded-full shadow-sm"></div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-bold text-base truncate ${isSelected ? "text-[var(--text-main)]" : "text-[var(--text-main)]"}`}>
              {conversation.fullName}
            </p>
          </div>
        </div>
      </div>
      {!lastidx && !isSelected && <div className="h-0.5 bg-gray-100 mx-4" />}
    </>
  );
};

export default Conversation;