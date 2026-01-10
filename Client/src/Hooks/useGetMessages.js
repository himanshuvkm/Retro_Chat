import { useState, useEffect } from "react";
import useConverstation from "../zustand/useconversation";
import { toast } from "react-hot-toast";
import { getUserFriendlyError } from "../utils/errorUtils";
const API_BASE = import.meta.env.VITE_API_URL;
const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConverstation();

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation?._id) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/message/${selectedConversation._id}`, { credentials: "include" });
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setMessages(data.data);
            } catch (error) {
                toast.error(getUserFriendlyError(error));
            } finally {
                setLoading(false);
            }
        };
        getMessages();
    }, [selectedConversation?._id, setMessages]);

    return { messages, loading };
};

export default useGetMessages;
