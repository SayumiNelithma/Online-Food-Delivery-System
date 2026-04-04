const axios = require("axios");
const Delivery = require("../models/Delivery");

const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL ||
  process.env.GATEWAY_URL ||
  "http://localhost:8000";

// POST /deliveries
const createDelivery = async (req, res) => {
  try {
    const {
      order_id,
      delivery_address,
      rider_name,
      driver_name,
      driver_phone,
      delivery_status,
      assigned_at,
      delivered_at
    } = req.body;

    if (!order_id || !delivery_address) {
      return res.status(400).json({
        message: "order_id and delivery_address are required"
      });
    }

    const orderResponse = await axios.get(
      `${API_GATEWAY_URL}/api/orders/${order_id}`
    );

    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const delivery = await Delivery.create({
      order_id,
      delivery_address,
      rider_name: rider_name || driver_name,
      driver_name: driver_name || rider_name,
      driver_phone,
      delivery_status: delivery_status || "ASSIGNED",
      assigned_at: assigned_at || new Date().toISOString(),
      delivered_at: delivered_at || null
    });

    res.status(201).json(delivery);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(500).json({
      message: "Error creating delivery",
      error: error.message
    });
  }
};

// GET /deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /deliveries/:id
const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /deliveries/:id
const updateDelivery = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (
      updateData.delivery_status === "DELIVERED" &&
      !updateData.delivered_at
    ) {
      updateData.delivered_at = new Date().toISOString();
    }

    if (updateData.rider_name && !updateData.driver_name) {
      updateData.driver_name = updateData.rider_name;
    }

    if (updateData.driver_name && !updateData.rider_name) {
      updateData.rider_name = updateData.driver_name;
    }

    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Auto-sync status with Order Service if delivered
    if (delivery.delivery_status === "DELIVERED") {
      try {
        await axios.put(`${API_GATEWAY_URL}/api/orders/${delivery.order_id}/status`, {
          status: "DELIVERED"
        });
      } catch (err) {
        console.error("Failed to sync status with Order Service:", err.message);
      }
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /deliveries/:id
const deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /deliveries/order/:orderId
const getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ order_id: req.params.orderId });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found for this order" });
    }
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /deliveries/rider/:riderName
const getDeliveriesByRider = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ rider_name: req.params.riderName });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getDeliveryByOrder,
  getDeliveriesByRider
};