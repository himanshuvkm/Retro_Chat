import { Mails, ArrowLeft } from "lucide-react";
import MessageInput from "./MessageInput";
import Messages from "./messages";
import useConversation from "../../zustand/useconversation"
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContetx";
import { useSocketContext } from "../../context/socketContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { socket } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  useEffect(() => {
    if (!socket) return;

    // Listen for direct messages typing
    const handleTyping = ({ senderId }) => {
      if (selectedConversation && senderId === selectedConversation._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (selectedConversation && senderId === selectedConversation._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing_direct", handleTyping);
    socket.on("stopTyping_direct", handleStopTyping);

    return () => {
      socket.off("typing_direct", handleTyping);
      socket.off("stopTyping_direct", handleStopTyping);
    };
  }, [socket, selectedConversation]);

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-[var(--window-bg)]">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-[var(--header-bg)] border-b-2 border-[var(--window-border)] px-5 py-3.5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white">
                <img src={selectedConversation?.profilePic || "https://avatar.iran.liara.run/public/boy"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Chatting With</div>
                <div className="text-[var(--text-main)] font-bold text-lg leading-tight flex items-center gap-2">
                  <span className="truncate max-w-[150px] md:max-w-md">{selectedConversation?.fullName}</span>
                  {isTyping && <span className="text-xs text-[var(--accent-coral)] animate-pulse italic lowercase">is typing...</span>}
                </div>
              </div>
            </div>

            {/* Back Button (Mobile Only) */}
            <button
              onClick={() => setSelectedConversation(null)}
              className="md:hidden p-2 hover:bg-black/5 rounded-full text-gray-500"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-center w-full h-full bg-[var(--window-bg)]">
      <div className="text-center flex flex-col items-center gap-4 p-10">
        <div className="w-20 h-20 flex items-center justify-center bg-[var(--accent-lavender)] rounded-full border-4 border-white shadow-lg animate-bounce">
          <Mails className="w-10 h-10 text-[var(--accent-coral)]" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl text-[var(--text-main)] font-bold">
            Hi, {authUser?.fullName}! 👋
          </p>
          <p className="text-md text-[var(--text-dim)]">
            Pick a friend to start chatting!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;