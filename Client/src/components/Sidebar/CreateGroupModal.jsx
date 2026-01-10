import { useState } from "react";
import { X, Check } from "lucide-react";
import useGetConversations from "../../Hooks/useGetConversation";
import { toast } from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { conversations } = useGetConversations(); // Reusing this to get list of users (though it now has groups too, need to filter)
    const [loading, setLoading] = useState(false);

    // Filter out existing groups to only show users
    const users = conversations.filter(c => !c.isGroup);

    const toggleUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim() || selectedUsers.length === 0) {
            toast.error("Please provide a name and select at least one member");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/message/group/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupName,
                    participants: selectedUsers
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success("Group created successfully! Refresh to see it.");
            onClose();
            // In a real app, we'd trigger a refresh of conversations here
            window.location.reload();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[var(--window-bg)] border-2 border-[var(--window-border)] w-96 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] relative rounded-lg overflow-hidden retro-window">

                {/* Header */}
                <div className="window-header mb-4">
                    <span className="font-bold text-[var(--header-text)] tracking-wider flex items-center gap-2">
                        <span className="text-sm">📁</span> New Group Chat
                    </span>
                    <button onClick={onClose} className="p-1 hover:bg-black/10 rounded">
                        <X size={16} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6 pt-0">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">Group Name</label>
                            <input
                                type="text"
                                className="w-full bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] px-4 py-2 rounded-md focus:outline-none focus:border-[var(--accent-peach)] focus:ring-2 focus:ring-[var(--accent-peach)/50] transition-all font-sans shadow-inner placeholder-gray-300"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="My Awesome Group"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">Add Friends</label>
                            <div className="h-48 overflow-y-auto border-2 border-[var(--window-border)] bg-white rounded-md p-2 custom-scrollbar shadow-inner">
                                {users.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => toggleUser(user._id)}
                                        className={`flex items-center gap-3 p-2 cursor-pointer mb-1 border-b border-transparent rounded-md transition-all ${selectedUsers.includes(user._id)
                                                ? 'bg-[var(--accent-lavender)] border-[var(--window-border)] shadow-sm'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden bg-white">
                                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-sans font-medium text-[var(--text-main)] flex-1">{user.fullName}</span>
                                        {selectedUsers.includes(user._id) && (
                                            <div className="bg-[var(--accent-mint)] rounded-full p-0.5 border border-black/10">
                                                <Check size={12} className="text-black/70" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {users.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No other users found.</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[var(--accent-mint)] hover:bg-[var(--accent-peach)] text-[var(--text-main)] font-bold rounded-md border-2 border-[var(--window-border)] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
