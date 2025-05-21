const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

// POST /api/auth/login
router.post(
  "/login",
  [
    check("email").isEmail().normalizeEmail(),
    check("password").exists().isLength({ min: 6 }),
  ],
  authController.login
);

// Temporary route to hash existing passwords (remove after use)
router.post("/hash-passwords", authController.hashPassword);

// Temporary route to hash existing passwords
router.post("/migrate-passwords", async (req, res) => {
  const users = await User.find();
  await Promise.all(
    users.map(async (user) => {
      if (!user.password.startsWith("$2a$")) {
        user.password = await bcrypt.hash(user.password, 12);
        await user.save();
      }
    })
  );
  res.json({ success: true });
});

module.exports = router;
