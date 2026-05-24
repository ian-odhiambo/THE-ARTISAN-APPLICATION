import User from "../models/user.model.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const currentUserRole = req.user.role || "customer";
    const oppositeRole = currentUserRole === "artisan" ? "customer" : "artisan";

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
      role: oppositeRole,
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in the getUsersforSidebar", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
