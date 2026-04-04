const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getOrdersByCustomer,
  getPaymentsByCustomer
} = require("../controllers/customerController");

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/:id/orders", getOrdersByCustomer);
router.get("/:id/payments", getPaymentsByCustomer);

module.exports = router;