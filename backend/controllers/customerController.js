// const Customer = require("../models/Customer");

// // Enhanced CRUD Operations
// module.exports = {
//   // Create customer with validation
//   createCustomer: async (req, res) => {
//     try {
//       const { name, phoneNumber, reference, remark } = req.body;

//       // Basic validation
//       if (!name || !phoneNumber) {
//         return res.status(400).json({
//           success: false,
//           message: "Name and phone number are required",
//         });
//       }

//       const newCustomer = await Customer.create({
//         name,
//         phoneNumber,
//         reference: reference || null,
//         remark: remark || null,
//       });

//       res.status(201).json({
//         success: true,
//         data: newCustomer,
//       });
//     } catch (error) {
//       console.error("Create customer error:", error);

//       // Handle duplicate phone numbers
//       if (error.code === 11000) {
//         return res.status(400).json({
//           success: false,
//           message: "Phone number already exists",
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   },

//   // Get all customers with pagination
//   getAllCustomers: async (req, res) => {
//     try {
//       const { page = 1, limit = 10 } = req.query;

//       const customers = await Customer.find()
//         .sort({ createdAt: -1 })
//         .limit(limit * 1)
//         .skip((page - 1) * limit);

//       const count = await Customer.countDocuments();

//       res.status(200).json({
//         success: true,
//         data: customers,
//         meta: {
//           totalPages: Math.ceil(count / limit),
//           currentPage: page,
//           totalCustomers: count,
//         },
//       });
//     } catch (error) {
//       console.error("Get customers error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   },

//   // Get single customer
//   getCustomerById: async (req, res) => {
//     try {
//       const customer = await Customer.findById(req.params.id);

//       if (!customer) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: customer,
//       });
//     } catch (error) {
//       console.error("Get customer error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   },

//   // Update customer
//   updateCustomer: async (req, res) => {
//     try {
//       const updatedCustomer = await Customer.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true }
//       );

//       if (!updatedCustomer) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: updatedCustomer,
//       });
//     } catch (error) {
//       console.error("Update customer error:", error);

//       if (error.name === "ValidationError") {
//         return res.status(400).json({
//           success: false,
//           message: "Validation failed",
//           errors: error.errors,
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   },

//   // Delete customer
//   deleteCustomer: async (req, res) => {
//     try {
//       const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

//       if (!deletedCustomer) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: {},
//       });
//     } catch (error) {
//       console.error("Delete customer error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   },

//   // Search customers by phone number
//   searchByPhoneNumber: async (req, res) => {
//     try {
//       const { phoneNumber } = req.params;
//       const { exactMatch = "false" } = req.query;

//       // Validation
//       if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
//         return res.status(400).json({
//           success: false,
//           message: "Phone number must contain only digits",
//         });
//       }

//       // Build query
//       const query =
//         exactMatch.toLowerCase() === "true"
//           ? { phoneNumber } // Exact match
//           : { phoneNumber: { $regex: phoneNumber, $options: "i" } }; // Partial match

//       const customers = await Customer.find(query)
//         .limit(50)
//         .sort({ createdAt: -1 });

//       if (customers.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No customers found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         count: customers.length,
//         data: customers,
//       });
//     } catch (error) {
//       console.error("Search error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error:
//           process.env.NODE_ENV === "development" ? error.message : undefined,
//       });
//     }
//   },
// };

const Customer = require("../models/Customer");

module.exports = {
  createCustomer: async (req, res) => {
    try {
      const { name, phoneNumber, source, service } = req.body;

      if (!name || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Name and phone number are required",
        });
      }

      const newCustomer = await Customer.create({
        name,
        phoneNumber,
        source: source || null,
        service: service || null,
      });

      res.status(201).json({
        success: true,
        data: newCustomer,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getAllCustomers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const customers = await Customer.find()
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const count = await Customer.countDocuments();

      res.status(200).json({
        success: true,
        data: customers,
        meta: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          totalCustomers: count,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // In your customer controller
  updateCustomer: async (req, res) => {
    try {
      const oldCustomer = await Customer.findById(req.params.id);
      const updates = req.body;

      // Create copy of updates without $push
      const updateFields = { ...updates };
      delete updateFields.$push;

      // Find changes
      const changes = {};
      Object.keys(updateFields).forEach((key) => {
        if (oldCustomer[key] !== updates[key]) {
          changes[key] = {
            old: oldCustomer[key],
            new: updates[key],
          };
        }
      });

      // Prepare update payload
      const updatePayload = { ...updateFields };
      if (Object.keys(changes).length > 0) {
        updatePayload.$push = {
          history: {
            changes: changes,
            modifiedBy: "system",
          },
        };
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        { new: true, runValidators: true }
      );

      if (!updatedCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: updatedCustomer,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  // Add to your controller
  saveDraft: async (req, res) => {
    try {
      const updates = req.body;

      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        { $set: { draft: updates } },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedCustomer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

      if (!deletedCustomer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  searchByPhoneNumber: async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      const { exactMatch = "false" } = req.query;

      if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Phone number must contain only digits",
        });
      }

      const query =
        exactMatch.toLowerCase() === "true"
          ? { phoneNumber }
          : { phoneNumber: { $regex: phoneNumber, $options: "i" } };

      const customers = await Customer.find(query)
        .limit(50)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
