import { toast } from "react-hot-toast";
import { useState } from "react";
import useConverstation from "../zustand/useconversation";
 const API_BASE = import.meta.env.VITE_API_URL;
const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConverstation();

    const sendMessage = async (message, type = "text", fileUrl = "") => {
        if (!selectedConversation) return;

        setLoading(true);
        try {
            // Determine endpoint based on conversation type (Group vs User)
            // Implementation note: The backend currently separates them, or we can handle it in the hook if we know it's a group.
            // For now, let's check `selectedConversation.isGroup` (which we need to make sure is populated).
            // Actually, for simplicity, I'll stick to the standard send ID and let backend handle or user routes.
            // The backend routes: /api/message/send/:id (User) and /api/message/group/send/:id (Group)

            const isGroup = selectedConversation.isGroup;
            const endpoint = isGroup
                ? `${API_BASE}/api/message/group/send/${selectedConversation._id}`
                : `${API_BASE}/api/message/send/${selectedConversation._id}`;

            const res = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    type,
                    fileUrl
                }),
            });

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setMessages([...messages, data.data]);
        } catch (error) {
            toast.error("Error sending message: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};

export default useSendMessage;

