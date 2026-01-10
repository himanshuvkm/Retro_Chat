import express from "express"
import protectRoute from "../Middleware/protectRoute.js"
const router = express.Router();
import { sendMessage, getMessage, sendGroupMessage, getGroups, getGroupMessages, createGroup, editMessage, deleteMessage, reactToMessage } from "../controller/message-controller.js";


router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);

router.post("/group/create", protectRoute, createGroup);
router.get("/group/list/all", protectRoute, getGroups);
router.get("/group/:groupId", protectRoute, getGroupMessages);
router.post("/group/send/:groupId", protectRoute, sendGroupMessage);

router.put("/edit/:messageId", protectRoute, editMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);
router.post("/react/:messageId", protectRoute, reactToMessage);

export default router;