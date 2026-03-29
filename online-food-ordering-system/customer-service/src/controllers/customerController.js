const axios = require("axios");
const Customer = require("../models/Customer");

const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL ||
  process.env.GATEWAY_URL ||
  "http://localhost:8000";

// POST /customers
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({
      message: "Error creating customer",
      error: error.message
    });
  }
};

// GET /customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message
    });
  }
};

// GET /customers/:id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      error: error.message
    });
  }
};

// PUT /customers/:id
const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({
      message: "Error updating customer",
      error: error.message
    });
  }
};

// DELETE /customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message
    });
  }
};
// GET /customers/:id/orders
const getOrdersByCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orderResponse = await axios.get(
      `${API_GATEWAY_URL}/api/orders/user/${req.params.id}`
    );

    res.status(200).json(orderResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer orders",
      error: error.message
    });
  }
};

// GET /customers/:id/payments
const getPaymentsByCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const paymentResponse = await axios.get(
      `${API_GATEWAY_URL}/api/payments/user/${req.params.id}`
    );

    res.status(200).json(paymentResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer payments",
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getOrdersByCustomer,
  getPaymentsByCustomer
};