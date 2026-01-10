import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: false // Can be empty if it's just an attachment
    },
    type: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text"
    },
    fileUrl: {
        type: String,
        default: ""
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        emoji: String
    }],
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema);
export default Message;
