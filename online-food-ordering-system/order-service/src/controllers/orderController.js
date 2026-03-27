const Order = require("../models/Order");

// GET /orders/:id
const getOrderById = async (req, res) => {
	try {
		const order = await Order.findOne({ orderId: req.params.id });
		if (!order) return res.status(404).json({ message: "Order not found" });
		res.status(200).json(order);
	} catch (error) {
		console.error("getOrderById error:", error.message);
		res.status(500).json({ message: "Failed to get order" });
	}
};

// PUT /orders/:id/status
const updateOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;
		if (!status) return res.status(400).json({ message: "status is required" });

		const order = await Order.findOne({ orderId: req.params.id });
		if (!order) return res.status(404).json({ message: "Order not found" });

		order.status = status;
		await order.save();

		res.status(200).json({ message: "Order status updated", order });
	} catch (error) {
		console.error("updateOrderStatus error:", error.message);
		res.status(500).json({ message: "Failed to update order status" });
	}
};

module.exports = { getOrderById, updateOrderStatus };
