const Delivery = require("../models/Delivery");

// POST /deliveries
const createDelivery = async (req, res) => {
  try {
    const {
      order_id,
      driver_name,
      driver_phone,
      delivery_address,
      delivery_status,
      assigned_at,
      delivered_at
    } = req.body;

    if (
      !order_id ||
      !driver_name ||
      !driver_phone ||
      !delivery_address
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const delivery = await Delivery.create({
      order_id,
      driver_name,
      driver_phone,
      delivery_address,
      delivery_status: delivery_status || "ASSIGNED",
      assigned_at: assigned_at || new Date().toISOString(),
      delivered_at: delivered_at || null
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    if (updateData.delivery_status === "DELIVERED" && !updateData.delivered_at) {
      updateData.delivered_at = new Date().toISOString();
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

module.exports = {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery
};