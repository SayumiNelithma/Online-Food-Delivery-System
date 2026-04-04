const axios = require("axios");
const Payment = require("../models/Payment");

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || process.env.GATEWAY_URL || process.env.API_GATEWAY || process.env.APIGW_URL;

const axiosInstance = axios.create({ timeout: 5000 });

// POST /payments/initiate
const initiatePayment = async (req, res) => {
	const { userId, orderId } = req.body;
	if (!userId || !orderId) {
		return res.status(400).json({ message: "userId and orderId are required" });
	}

	try {
		// validate user via API Gateway
		const userResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/customers/${userId}`);
		if (userResp.status !== 200 || !userResp.data) {
			return res.status(404).json({ message: "User not found" });
		}

		// fetch order
		const orderResp = await axiosInstance.get(`${API_GATEWAY_URL}/api/orders/${orderId}`);
		if (orderResp.status !== 200 || !orderResp.data) {
			return res.status(404).json({ message: "Order not found" });
		}

		const amount = orderResp.data.totalAmount;
		const payment = await Payment.create({ userId, orderId, amount, status: "PENDING" });

		res.status(201).json({ message: "Payment initiated", payment });
	} catch (error) {
		console.error("initiatePayment error:", error.message);
		if (error.response && error.response.status === 404) {
			return res.status(404).json({ message: "User or Order not found" });
		}
		res.status(500).json({ message: "Failed to initiate payment" });
	}
};

// POST /payments/confirm
const confirmPayment = async (req, res) => {
	const { paymentId } = req.body;
	if (!paymentId) return res.status(400).json({ message: "paymentId is required" });

	try {
		const payment = await Payment.findOne({ paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });

		payment.status = "SUCCESS";
		await payment.save();

		// notify Order service
		try {
			await axiosInstance.put(`${API_GATEWAY_URL}/api/orders/${payment.orderId}/status`, { status: "PAID" });
		} catch (err) {
			console.error("Failed to update order status:", err.message);
		}

		res.status(200).json({ message: "Payment confirmed", payment });
	} catch (error) {
		console.error("confirmPayment error:", error.message);
		res.status(500).json({ message: "Failed to confirm payment" });
	}
};

// POST /payments/cancel
const cancelPayment = async (req, res) => {
	const { paymentId } = req.body;
	if (!paymentId) return res.status(400).json({ message: "paymentId is required" });

	try {
		const payment = await Payment.findOne({ paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });

		payment.status = "FAILED";
		await payment.save();

		res.status(200).json({ message: "Payment cancelled", payment });
	} catch (error) {
		console.error("cancelPayment error:", error.message);
		res.status(500).json({ message: "Failed to cancel payment" });
	}
};

// POST /payments/refund
const refundPayment = async (req, res) => {
	const { paymentId } = req.body;
	if (!paymentId) return res.status(400).json({ message: "paymentId is required" });

	try {
		const payment = await Payment.findOne({ paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });

		payment.status = "REFUNDED";
		await payment.save();

		res.status(200).json({ message: "Payment refunded", payment });
	} catch (error) {
		console.error("refundPayment error:", error.message);
		res.status(500).json({ message: "Failed to refund payment" });
	}
};

// POST /payments/webhook
const webhook = async (req, res) => {
	const { paymentId, status } = req.body;
	if (!paymentId || !status) return res.status(400).json({ message: "paymentId and status are required" });

	if (!["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(status)) {
		return res.status(400).json({ message: "invalid status" });
	}

	try {
		const payment = await Payment.findOne({ paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });

		payment.status = status;
		await payment.save();

		res.status(200).json({ message: "Webhook processed", payment });
	} catch (error) {
		console.error("webhook error:", error.message);
		res.status(500).json({ message: "Failed to process webhook" });
	}
};

// GET /payments/:paymentId
const getPaymentById = async (req, res) => {
	try {
		const payment = await Payment.findOne({ paymentId: req.params.paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });
		res.status(200).json(payment);
	} catch (error) {
		console.error("getPaymentById error:", error.message);
		res.status(500).json({ message: "Failed to get payment" });
	}
};

// GET /payments/order/:orderId
const getPaymentsByOrder = async (req, res) => {
	try {
		const payments = await Payment.find({ orderId: req.params.orderId });
		res.status(200).json(payments);
	} catch (error) {
		console.error("getPaymentsByOrder error:", error.message);
		res.status(500).json({ message: "Failed to get payments" });
	}
};

// GET /payments/user/:userId
const getPaymentsByUser = async (req, res) => {
	try {
		const payments = await Payment.find({ userId: req.params.userId });
		res.status(200).json(payments);
	} catch (error) {
		console.error("getPaymentsByUser error:", error.message);
		res.status(500).json({ message: "Failed to get payments" });
	}
};

// GET /payments/status/:paymentId
const getPaymentStatus = async (req, res) => {
	try {
		const payment = await Payment.findOne({ paymentId: req.params.paymentId });
		if (!payment) return res.status(404).json({ message: "Payment not found" });
		res.status(200).json({ paymentId: payment.paymentId, status: payment.status });
	} catch (error) {
		console.error("getPaymentStatus error:", error.message);
		res.status(500).json({ message: "Failed to get payment status" });
	}
};

module.exports = {
	initiatePayment,
	confirmPayment,
	cancelPayment,
	refundPayment,
	webhook,
	getPaymentById,
	getPaymentsByOrder,
	getPaymentsByUser,
	getPaymentStatus
};

