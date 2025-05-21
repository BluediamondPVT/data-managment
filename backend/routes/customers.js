const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchByPhoneNumber, // Import the new search function
} = require("../controllers/customerController");

// CRUD Routes
router.post("/", createCustomer); // Create customer
router.get("/", getAllCustomers); // Get all customers
router.get("/:id", getCustomerById); // Get single customer by ID
router.put("/:id", updateCustomer); // Update single customer
router.delete("/:id", deleteCustomer); // Delete single customer

// Search Routes
router.get("/search/phone/:phoneNumber", searchByPhoneNumber); // Search by phone number

module.exports = router;
