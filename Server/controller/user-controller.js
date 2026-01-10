import User from "../Models/user-model.js";
export const getUsersForSidebar = async (req, res) => {
    try {

        const loggedInUser = req.user._id

        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } })

        res.status(200).json({ message: "Users retrieved successfully", data: filteredUsers });

    } catch (error) {
        console.log("Error in get user for sidebar controller ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, bio, profilePic } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            bio,
            profilePic
        }, { new: true });

        res.status(200).json({ message: "Profile updated successfully", data: updatedUser });

    } catch (error) {
        console.log("Error in update user profile ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};