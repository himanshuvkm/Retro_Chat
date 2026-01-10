import { Send, Paperclip, X } from "lucide-react";
import { useState, useRef } from "react";
import useSendMessage from "../../Hooks/useSendMessage";
import { toast } from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";
import useConversation from "../../zustand/useconversation";
import { useAuthContext } from "../../context/AuthContetx";
const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit for Base64 MVP
                toast.error("File size too large (Max 2MB)");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (preview) URL.revokeObjectURL(preview); // Clean up object URL
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !file) return;

        // Determine type and fileUrl based on file presence
        let type = "text";
        let fileUrl = "";

        if (file) {
            type = file.type.startsWith("image/") ? "image" : "file";
            // For MVP, we are sending the base64 string directly or handling it in useSendMessage. 
            // Ideally, upload to cloud here and get URL. 
            // But useSendMessage expects fileUrl. Let's convert to base64 here for consistency if needed or pass the file.
            // Actually useSendMessage seems to handle it?  Let's check previous implementation.
            // Previous implementation of useSendMessage handled JSON body. So we must convert to Base64 here.
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                await sendMessage(message, type, reader.result);
                setMessage("");
                clearFile();
                if (socket) socket.emit("stopTyping_direct", { receiverId: selectedConversation._id });
            }
            return;
        }

        await sendMessage(message, type, fileUrl);
        setMessage("");
        if (socket) socket.emit("stopTyping_direct", { receiverId: selectedConversation._id });
    };

    const handleChange = (e) => {
        setMessage(e.target.value);

        if (!socket || !selectedConversation) return;

        socket.emit("typing_direct", { receiverId: selectedConversation._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping_direct", { receiverId: selectedConversation._id });
        }, 2000);
    };

    return (
        <div className="px-5 py-4 bg-[var(--window-bg)] border-t-2 border-[var(--window-border)]">
            {/* File Preview */}
            {preview && (
                <div className="mb-3 relative w-fit p-1 bg-white border-2 border-[var(--window-border)] shadow-md rotate-2">
                    {file.type.startsWith("image/") ? (
                        <img src={preview} alt="Preview" className="h-24 w-24 object-cover" />
                    ) : (
                        <div className="h-20 w-20 flex items-center justify-center bg-gray-100 text-[var(--text-main)] text-xs p-1 font-bold">{file.name}</div>
                    )}
                    <button onClick={clearFile} className="absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-white rounded-full p-1 border-2 border-white shadow-sm"><X size={14} /></button>
                </div>
            )}

            <form className="w-full relative flex items-center gap-3" onSubmit={handleSubmit}>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-[var(--accent-coral)] transition-colors p-2 bg-white rounded-full border-2 border-[var(--window-border)] shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Paperclip size={18} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <input
                    type="text"
                    className="flex-1 text-base bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] px-5 py-3 rounded-full focus:outline-none focus:border-[var(--accent-peach)] focus:ring-2 focus:ring-[var(--accent-peach)/50] transition-all font-sans placeholder-gray-400 shadow-inner"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleChange}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="p-3 bg-[var(--accent-mint)] hover:bg-[var(--accent-peach)] text-[var(--text-main)] rounded-full border-2 border-[var(--window-border)] shadow-[2px_2px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || (!message.trim() && !file)}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;