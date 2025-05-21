const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }

    // Password comparison
    // Replace direct bcrypt.compare with:
    const isMatch = await user.comparePassword(password);

    // Successful login
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Add this temporary endpoint to fix existing users
exports.hashPassword = async (req, res) => {
  try {
    const users = await User.find();
    for (const user of users) {
      if (!user.password.startsWith("$2a$")) {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
