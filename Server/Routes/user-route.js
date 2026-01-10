import express from "express"
import protectRoute from "../Middleware/protectRoute.js";
import { getUsersForSidebar, updateUserProfile } from "../controller/user-controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.put("/update", protectRoute, updateUserProfile);

export default router;