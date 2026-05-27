import User from "../models/user.model.js";

export const getUsersforSidebar = async (req, res) => {
  try {
    console.log("[getUsersforSidebar] req.user:", {
      _id: req.user?._id,
      role: req.user?.role,
    });

    const loggedInUserId = req.user._id;

    // Use the DB role coming from JWT user (req.user)
    const currentUserRole = (req.user.role || "customer").toString();
    const oppositeRole = currentUserRole === "artisan" ? "customer" : "artisan";

    // Role can contain case/whitespace mismatches in real DB records.
    // Make the match tolerant.
    const normalizedOppositeRole = oppositeRole.trim().toLowerCase();
    const roleQuery = {
      role: { $regex: `^${normalizedOppositeRole}$`, $options: "i" },
    };

    // Extra debug: verify what exists in DB right now.
    const [allCustomers, allArtisans] = await Promise.all([
      User.countDocuments({
        role: { $regex: "^customer$", $options: "i" },
      }),
      User.countDocuments({
        role: { $regex: "^artisan$", $options: "i" },
      }),
    ]);

    console.log("[getUsersforSidebar] oppositeRole:", oppositeRole);
    console.log("[getUsersforSidebar] DB counts -> customers:", allCustomers);
    console.log("[getUsersforSidebar] DB counts -> artisans:", allArtisans);

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
      ...roleQuery,
    }).select("-password");

    console.log(
      "[getUsersforSidebar] filteredUsers count:",
      filteredUsers?.length,
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in the getUsersforSidebar", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};


