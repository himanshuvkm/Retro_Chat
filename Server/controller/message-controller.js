import Conversation from "../Models/conversation-model.js"
import Message from "../Models/mssg-model.js"
import { getReceiverSocketId  } from "../Socket/socketHandlers.js";
import { io } from "../Socket/socket.io.js";


export const sendMessage = async (req, res) => {
    try {
        const { message, type, fileUrl } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            isGroup: false
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            type: type || "text",
            fileUrl: fileUrl || ""
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()])

        //This will run in parallel
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ message: "Message sent successfully", data: newMessage });

    } catch (error) {
        console.log("Error in send message controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            isGroup: false
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json({ message: "No conversation found", data: [] });
        }

        res.status(200).json({ message: "Messages retrieved successfully", data: conversation.messages });
    } catch (error) {
        console.log("Error in get message controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// --------------------- GROUP CONTROLLERS ---------------------

export const createGroup = async (req, res) => {
    try {
        const { groupName, participants, groupImage } = req.body;
        const adminId = req.user._id;

        // participants should be an array of user IDs. Add admin to it.
        const allParticipants = [...participants, adminId];

        const newGroup = await Conversation.create({
            isGroup: true,
            groupName,
            groupAdmin: adminId,
            participants: allParticipants,
            groupImage: groupImage || "",
            messages: []
        });

        res.status(201).json({ message: "Group created successfully", data: newGroup });

    } catch (error) {
        console.log("Error in create group controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const { id: groupId } = req.params;

        // Check if user is participant? (Optional for security)
        const conversation = await Conversation.findById(groupId).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ message: "Group messages retrieved", data: conversation.messages });

    } catch (error) {
        console.log("Error in get group messages ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { message, type, fileUrl } = req.body;
        const { id: groupId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findById(groupId);

        if (!conversation) {
            return res.status(404).json({ message: "Group not found" });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId: groupId, // For groups, receiverId is the Group ID (Conversation ID)
            message,
            type: type || "text",
            fileUrl: fileUrl || ""
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // Socket.io for Groups
        // We need to emit to all participants
        conversation.participants.forEach((participantId) => {
            if (participantId.toString() !== senderId.toString()) {
                const receiverSocketId = getReceiverSocketId(participantId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", newMessage);
                }
            }
        });

        res.status(201).json({ message: "Group message sent", data: newMessage });

    } catch (error) {
        console.log("Error in send group message ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Conversation.find({
            participants: userId,
            isGroup: true
        }).sort({ updatedAt: -1 });

        res.status(200).json({ message: "Groups retrieved", data: groups });
    } catch (error) {
        console.log("Error in get groups ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message } = req.body;

        const msg = await Message.findById(messageId);
        if (!msg) return res.status(404).json({ error: "Message not found" });

        const updatedMessage = await Message.findByIdAndUpdate(messageId, {
            message,
            isEdited: true
        }, { new: true });

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.log("Error in edit message controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({ message: "Message deleted successfully", messageId });
    } catch (error) {
        console.log("Error in delete message controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const reactToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ error: "Message not found" });

        if (!message.reactions) message.reactions = [];
        message.reactions = message.reactions.filter(r => r.userId.toString() !== userId.toString());

        message.reactions.push({ userId, emoji });

        await message.save();

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in react to message controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};