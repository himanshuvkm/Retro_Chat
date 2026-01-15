import { useAuthContext } from "../../context/AuthContetx";
import useConversation from '../../zustand/useconversation';
import { extractTime } from '../../utils/extracttime';
import { Download, FileText, Pencil, Trash2, Smile } from 'lucide-react';
import { useState } from "react";
import toast from "react-hot-toast";
import { getUserFriendlyError } from '../../utils/errorUtils';
export const API_BASE = import.meta.env.VITE_API_URL;

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);

    // Retro Styles
    const bubbleClass = fromMe
        ? "bg-[var(--accent-mint)] border-2 border-[var(--window-border)] text-[var(--text-main)] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-none"
        : "bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] rounded-tr-xl rounded-tl-xl rounded-br-xl rounded-bl-none";

    // Shake animation for new messages could be applied here
    const shakeClass = message.shouldShake ? "shake" : "";

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.message);
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const handleReact = async (emoji) => {
        try {
            const res = await fetch(`${API_BASE}/api/message/react/${message._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ emoji })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Optimistic update
            if (!message.reactions) message.reactions = [];
            // Remove my previous reaction
            message.reactions = message.reactions.filter(r => r.userId !== authUser._id);
            message.reactions.push({ userId: authUser._id, emoji });

            setShowReactionPicker(false);
        } catch (error) {
            toast.error(getUserFriendlyError(error));
        }
    };

    const handleEdit = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/message/edit/${message._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ message: editContent })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Optimistic update or refresh needed. 
            // Ideally Zustand store should be updated.
            // For MVP, we can just update local state or rely on full refresh.
            // But we need to update the message in the list.
            message.message = editContent;
            message.isEdited = true;
            setIsEditing(false);
            toast.success("Message edited");
        } catch (error) {
            toast.error(getUserFriendlyError(error));
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this message?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/message/delete/${message._id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Optimistic hidden
            // Ideally should filter out from Zustand store
            message.deleted = true; // Use this flag to hide it
            toast.success("Message deleted");
        } catch (error) {
            toast.error(getUserFriendlyError(error));
        }
    };

    if (message.deleted) return null; // Hide if deleted
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;

    return (
        <div className={`flex ${fromMe ? 'justify-end' : 'justify-start'} mb-6 px-4 group`}>
            <div className={`flex items-end gap-3 max-w-[80%] ${fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-8 h-8 flex-shrink-0 border-2 border-white rounded-full bg-white shadow-sm overflow-hidden transform translate-y-1">
                    <img
                        alt=""
                        src={profilePic || "https://avatar.iran.liara.run/public/boy"}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${fromMe ? 'items-end' : 'items-start'} group relative`}> {/* Added group relative */}

                    {/* Header */}
                    <span className="text-xs text-gray-400 font-bold mb-1 px-1 tracking-wide">
                        {fromMe ? "ME" : selectedConversation?.fullName.toUpperCase()}
                    </span>

                    {/* Message Bubble */}
                    <div className={`${bubbleClass} ${shakeClass} px-4 py-3 relative`}>
                        {/* Media Rendering */}
                        {message.type === 'image' && message.fileUrl && (
                            <div className="mb-2 p-1 bg-white border border-gray-200 rounded-sm">
                                <img src={message.fileUrl} alt="Attachment" className="max-w-[250px] sm:max-w-[300px] max-h-[300px] object-cover rounded-sm" />
                            </div>
                        )}

                        {message.type === 'file' && message.fileUrl && (
                            <a href={message.fileUrl} download target="_blank" rel="noreferrer" className="flex items-center gap-2 mb-2 p-3 bg-white/50 border border-black/10 rounded-lg hover:bg-white transition-colors">
                                <FileText size={20} className="text-gray-600" />
                                <span className="text-sm font-bold underline overflow-hidden text-ellipsis text-blue-600">Download File</span>
                                <Download size={16} className="text-gray-400" />
                            </a>
                        )}

                        {message.message && <p className="text-base leading-relaxed font-sans">{message.message}</p>}
                    </div>

                    {/* Actions & Timestamp */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                        <time className="text-xs text-gray-400 font-bold bg-[var(--window-bg)] px-2 py-0.5 rounded-full border border-gray-200">
                            {formattedTime} {message.isEdited && <span className="italic text-[10px] ml-1">(edited)</span>}
                        </time>

                        {/* Reaction Button (Visible on Group Hover) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 items-center">
                            <button onClick={() => setShowReactionPicker(!showReactionPicker)} className="p-1 hover:bg-black/5 rounded text-gray-400 hover:text-yellow-500 transition-colors" title="React">
                                <Smile size={14} />
                            </button>

                            {/* Edit/Delete Actions for Sender */}
                            {fromMe && (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-black/5 rounded text-gray-500 hover:text-blue-500" title="Edit">
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={handleDelete} className="p-1 hover:bg-black/5 rounded text-gray-500 hover:text-red-500" title="Delete">
                                        <Trash2 size={12} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Reaction Picker */}
                    {showReactionPicker && (
                        <div className="absolute top-full left-0 z-20 bg-white border-2 border-[var(--window-border)] p-2 rounded-lg shadow-lg flex gap-1 mt-1">
                            {["👍", "❤️", "😂", "😮", "😢", "🔥"].map(emoji => (
                                <button key={emoji} onClick={() => handleReact(emoji)} className="hover:scale-125 transition-transform text-lg">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Display Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className="absolute bottom-[-10px] right-2 flex gap-1">
                            {message.reactions.slice(0, 3).map((r, idx) => (
                                <span key={idx} className="bg-white border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm">
                                    {r.emoji}
                                </span>
                            ))}
                            {message.reactions.length > 3 && (
                                <span className="bg-white border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-[8px] font-bold shadow-sm text-gray-500">
                                    +{message.reactions.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Edit Modal (Simple Inline) */}
                    {isEditing && (
                        <div className="absolute right-0 bottom-8 z-10 bg-white border-2 border-[var(--window-border)] p-2 rounded-lg shadow-lg w-64">
                            <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full text-sm border border-gray-300 p-1 rounded mb-2"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                                <button onClick={handleEdit} className="text-xs px-2 py-1 bg-[var(--accent-mint)] rounded hover:bg-green-300 font-bold">Save</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;