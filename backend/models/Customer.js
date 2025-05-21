// const mongoose = require("mongoose");

// const CustomerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true, unique: true }, // 👈 make unique
//   reference: { type: String },
//   remark: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Customer", CustomerSchema);

// const mongoose = require("mongoose");

//   const CustomerSchema = new mongoose.Schema(
//     {
//       name: {
//         type: String,
//         required: [true, "Name is required"],
//         trim: true,
//       },
//       phoneNumber: {
//         type: String,
//         required: [true, "Phone number is required"],
//         unique: true,
//         trim: true,
//       },
//       reference: {
//         type: String,
//         trim: true,
//       },
//       remark: {
//         type: String,
//         trim: true,
//       },
//       service: {
//         type: String,
//         trim: true,
//         default: null,
//       },
//       option: {
//         type: String,
//         trim: true,
//         default: null,
//       },
//       statusColor: {
//         type: String,
//         trim: true,
//         default: null, // This will store the color code based on the option selected
//       },
//     },
//     { timestamps: true }
//   );

//   module.exports = mongoose.model("Customer", CustomerSchema);

// V3

const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
      default: null,
    },
    service: {
      type: String,
      trim: true,
      default: null,
    },
    remark: {
      type: String,
      trim: true,
      default: null,
    },
    history: [
      {
        timestamp: { type: Date, default: Date.now },
        changes: Object,
        modifiedBy: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
