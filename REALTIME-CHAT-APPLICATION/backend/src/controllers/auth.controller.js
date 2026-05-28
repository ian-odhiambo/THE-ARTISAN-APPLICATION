import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      confirmPassword,
      role = "customer",
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const normalizedRole = ["artisan", "customer"].includes(role)
      ? role
      : "customer";

    //Hashed passwords here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Replaced avatar generator with Dicebear avatars using current v6 endpoints

    const profilePic = `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      profilePic,
      role: normalizedRole,
    });

    if (newUser) {
      //Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    let { username, password, role } = req.body;
    username = typeof username === "string" ? username.trim() : username;
    role = typeof role === "string" ? role.trim().toLowerCase() : role;

    console.log("[LOGIN] received username:", username);
    console.log(
      "[LOGIN] received password length:",
      typeof password === "string" ? password.length : "not-a-string",
    );
    console.log("[LOGIN] received role:", role);

    const user = await User.findOne({ username });
    console.log("[LOGIN] user found:", !!user);
    console.log("[LOGIN] user._id:", user?._id);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );
    console.log("[LOGIN] password match:", isPasswordCorrect);

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (role && ["customer", "artisan"].includes(role) && role !== user.role) {
      return res.status(400).json({
        error: `Role mismatch: this account is registered as ${user.role}. Please login with the correct role.`,
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role || "customer",
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { fullName, username, password, role } = req.body;

    // If role is missing, we should not silently fall back to customer,
    // otherwise all synced users will end up as customers.
    if (!role) {
      return res.status(400).json({ error: "Missing role in sync payload" });
    }

    console.log("[syncUser] incoming role:", req.body?.role);



    if (!fullName || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedRole = ["artisan", "customer"].includes(role)
      ? role
      : "customer";
    const existingUser = await User.findOne({ username });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePic = `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.password = hashedPassword;
      existingUser.profilePic = profilePic;
      // Keep the chat user's role aligned with the ecommerce role on every sync/login.
      existingUser.role = normalizedRole;
      await existingUser.save();
      return res.status(200).json({ message: "Chat user synced" });
    }

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      profilePic,
      role: normalizedRole,
    });

    await newUser.save();
    res.status(201).json({ message: "Chat user created" });
  } catch (error) {
    console.log("Error in syncUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("Logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
