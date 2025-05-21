const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove `useCreateIndex: true` (deprecated in Mongoose 6+)
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit on DB connection failure
  }
};

module.exports = connectDB;
