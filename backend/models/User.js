const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Using bcryptjs v3.0.2

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: "Phone number must be 10-15 digits",
      },
    },
  },
  { timestamps: true }
);

// Password hashing middleware (optimized for bcryptjs@3.0.2)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // bcryptjs v3.0.2 automatically handles salt generation
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(new Error("Password hashing failed"));
  }
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
  