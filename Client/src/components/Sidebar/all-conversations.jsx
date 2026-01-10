import React from "react";
import useGetConversations from "../../Hooks/useGetConversation";
import Conversation from "./conversation";


const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return (
        <div className='py-2 flex flex-col overflow-auto bg-[var(--window-bg)] h-full custom-scrollbar'>
            {!loading && conversations.map((conversation, index) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastidx={index === conversations.length - 1}
                />
            ))}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[var(--retro-border)] border-t-[var(--retro-green)] rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default Conversations;