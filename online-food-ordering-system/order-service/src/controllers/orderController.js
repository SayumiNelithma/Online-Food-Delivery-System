const axios = require("axios");
const Order = require("../models/Order");

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || process.env.GATEWAY_URL || process.env.API_GATEWAY || process.env.APIGW_URL || "http://localhost:5000";
const axiosInstance = axios.create({ timeout: 5000 });

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

// POST /orders
const createOrder = async (req, res) => {
	try {
		const { userId, items, totalAmount } = req.body;
		if (!userId || !items || items.length === 0) {
			return res.status(400).json({ message: "userId and items are required" });
		}

		// Validate user via API Gateway
		const userResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/customers/${userId}`);
		if (userResp.status !== 200 || !userResp.data) {
			return res.status(404).json({ message: "User not found" });
		}

		let calculatedTotal = 0;
		if (totalAmount === undefined) {
			for (const item of items) {
				calculatedTotal += (item.price || 0) * (item.quantity || 1);
			}
		}

		const finalAmount = totalAmount !== undefined ? totalAmount : calculatedTotal;

		const order = await Order.create({
			userId,
			items,
			totalAmount: finalAmount,
			status: "CREATED"
		});

		res.status(201).json({ message: "Order created successfully", order });
	} catch (error) {
		console.error("createOrder error:", error.message);
		if (error.response && error.response.status === 404) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(500).json({ message: "Failed to create order" });
	}
};

// GET /orders
const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		console.error("getAllOrders error:", error.message);
		res.status(500).json({ message: "Failed to get orders" });
	}
};

// GET /orders/user/:userId
const getOrdersByUser = async (req, res) => {
	try {
		const orders = await Order.find({ userId: req.params.userId });
		res.status(200).json(orders);
	} catch (error) {
		console.error("getOrdersByUser error:", error.message);
		res.status(500).json({ message: "Failed to get user orders" });
	}
};

// POST /orders/:id/pay
const payForOrder = async (req, res) => {
	try {
		const order = await Order.findOne({ orderId: req.params.id });
		if (!order) return res.status(404).json({ message: "Order not found" });

		if (order.status !== "CREATED") {
			return res.status(400).json({ message: "Order cannot be paid for in its current status: " + order.status });
		}

		// Proxy to payment-service to initiate payment
		const paymentResp = await axiosInstance.post(`${API_GATEWAY_URL}/api/payments/initiate`, {
			userId: order.userId,
			orderId: order.orderId,
			amount: order.totalAmount
		});

		res.status(200).json({ message: "Payment initiated", payment: paymentResp.data.payment });
	} catch (error) {
		console.error("payForOrder error:", error.message);
		if (error.response && error.response.status) {
			return res.status(error.response.status).json(error.response.data);
		}
		res.status(500).json({ message: "Failed to initiate payment" });
	}
};

// GET /orders/:id/payments
const getOrderPayments = async (req, res) => {
	try {
		const paymentResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/payments/order/${req.params.id}`);
		res.status(200).json(paymentResp.data);
	} catch (error) {
		console.error("getOrderPayments error:", error.message);
		if (error.response && error.response.status) {
			return res.status(error.response.status).json(error.response.data);
		}
		res.status(500).json({ message: "Failed to fetch order payments" });
	}
};

// POST /orders/:id/refund
const refundOrder = async (req, res) => {
	try {
		const order = await Order.findOne({ orderId: req.params.id });
		if (!order) return res.status(404).json({ message: "Order not found" });

		// Fetch payments to find the successful one
		const paymentsResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/payments/order/${req.params.id}`);
		const payments = paymentsResp.data;

		const successfulPayment = payments.find(p => p.status === "SUCCESS");
		if (!successfulPayment) {
			return res.status(400).json({ message: "No successful payment found to refund" });
		}

		// Proxy to payment-service to refund
		const refundResp = await axiosInstance.post(`${API_GATEWAY_URL}/api/payments/refund`, {
			paymentId: successfulPayment.paymentId
		});

		res.status(200).json({ message: "Order refunded", refund: refundResp.data.payment });
	} catch (error) {
		console.error("refundOrder error:", error.message);
		if (error.response && error.response.status) {
			return res.status(error.response.status).json(error.response.data);
		}
		res.status(500).json({ message: "Failed to refund order" });
	}
};

// PUT /orders/:id/cancel
const cancelOrder = async (req, res) => {
	try {
		const order = await Order.findOne({ orderId: req.params.id });
		if (!order) return res.status(404).json({ message: "Order not found" });

		if (order.status === "CANCELLED") {
			return res.status(400).json({ message: "Order is already cancelled" });
		}

		const previousStatus = order.status;
		order.status = "CANCELLED";
		await order.save();

		// If it was already paid, attempt a refund
		if (previousStatus === "PAID") {
			try {
				const paymentsResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/payments/order/${req.params.id}`);
				const successfulPayment = paymentsResp.data.find(p => p.status === "SUCCESS");
				if (successfulPayment) {
					await axiosInstance.post(`${API_GATEWAY_URL}/api/payments/refund`, {
						paymentId: successfulPayment.paymentId
					});
				}
			} catch (refundErr) {
				console.error("Failed to process automatic refund during cancellation:", refundErr.message);
			}
		}

		res.status(200).json({ message: "Order cancelled", order });
	} catch (error) {
		console.error("cancelOrder error:", error.message);
		res.status(500).json({ message: "Failed to cancel order" });
	}
};

module.exports = {
	createOrder,
	getAllOrders,
	getOrderById,
	getOrdersByUser,
	updateOrderStatus,
	payForOrder,
	getOrderPayments,
	refundOrder,
	cancelOrder
};
