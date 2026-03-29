const axios = require("axios");
const Payment = require("../models/Payment");

const API_GATEWAY_URL =
  process.env.API_GATEWAY_URL ||
  process.env.GATEWAY_URL ||
  process.env.API_GATEWAY ||
  process.env.APIGW_URL ||
  "http://localhost:8000";

const axiosInstance = axios.create({ timeout: 5000 });

// POST /payments
const createPayment = async (req, res) => {
  try {
    const {
      user_id,
      order_id,
      amount,
      payment_method,
      payment_status
    } = req.body;

    if (!order_id || amount == null || !payment_method) {
      return res.status(400).json({
        message: "order_id, amount, and payment_method are required"
      });
    }

    const orderResponse = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/orders/${order_id}`
    );

    const order = orderResponse.data;

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let resolvedUserId = user_id || order.customer_id || order.userId;

    if (resolvedUserId) {
      try {
        await axiosInstance.get(
          `${API_GATEWAY_URL}/api/customers/${resolvedUserId}`
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          return res.status(404).json({ message: "User not found" });
        }
      }
    }

    const payment = await Payment.create({
      userId: resolvedUserId,
      orderId: order_id,
      order_id,
      amount,
      payment_method,
      payment_status: payment_status || "PENDING",
      status: payment_status || "PENDING"
    });

    res.status(201).json({
      message: "Payment created successfully",
      payment
    });
  } catch (error) {
    console.error("createPayment error:", error.message);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(500).json({
      message: "Failed to create payment",
      error: error.message
    });
  }
};

// POST /payments/initiate
const initiatePayment = async (req, res) => {
  const { userId, orderId, amount, payment_method } = req.body;

  if (!userId || !orderId || amount == null) {
    return res.status(400).json({
      message: "userId, orderId and amount are required"
    });
  }

  try {
    const userResp = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/customers/${userId}`
    );

    if (userResp.status !== 200 || !userResp.data) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderResp = await axiosInstance.get(
      `${API_GATEWAY_URL}/api/orders/${orderId}`
    );

    if (orderResp.status !== 200 || !orderResp.data) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      userId,
      orderId,
      order_id: orderId,
      amount,
      payment_method,
      payment_status: "PENDING",
      status: "PENDING"
    });

    res.status(201).json({
      message: "Payment initiated",
      payment
    });
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

  if (!paymentId) {
    return res.status(400).json({ message: "paymentId is required" });
  }

  try {
    const payment =
      (await Payment.findOne({ paymentId })) ||
      (await Payment.findById(paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "SUCCESS";
    payment.payment_status = "SUCCESS";
    await payment.save();

    try {
      await axiosInstance.put(
        `${API_GATEWAY_URL}/api/orders/${payment.orderId || payment.order_id}/status`,
        { status: "PAID" }
      );
    } catch (err) {
      console.error("Failed to update order status:", err.message);
    }

    res.status(200).json({
      message: "Payment confirmed",
      payment
    });
  } catch (error) {
    console.error("confirmPayment error:", error.message);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

// POST /payments/cancel
const cancelPayment = async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ message: "paymentId is required" });
  }

  try {
    const payment =
      (await Payment.findOne({ paymentId })) ||
      (await Payment.findById(paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "FAILED";
    payment.payment_status = "FAILED";
    await payment.save();

    res.status(200).json({
      message: "Payment cancelled",
      payment
    });
  } catch (error) {
    console.error("cancelPayment error:", error.message);
    res.status(500).json({ message: "Failed to cancel payment" });
  }
};

// POST /payments/refund
const refundPayment = async (req, res) => {
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ message: "paymentId is required" });
  }

  try {
    const payment =
      (await Payment.findOne({ paymentId })) ||
      (await Payment.findById(paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "REFUNDED";
    payment.payment_status = "REFUNDED";
    await payment.save();

    res.status(200).json({
      message: "Payment refunded",
      payment
    });
  } catch (error) {
    console.error("refundPayment error:", error.message);
    res.status(500).json({ message: "Failed to refund payment" });
  }
};

// POST /payments/webhook
const webhook = async (req, res) => {
  const { paymentId, status } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({
      message: "paymentId and status are required"
    });
  }

  if (!["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(status)) {
    return res.status(400).json({ message: "invalid status" });
  }

  try {
    const payment =
      (await Payment.findOne({ paymentId })) ||
      (await Payment.findById(paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    payment.payment_status = status;
    await payment.save();

    res.status(200).json({
      message: "Webhook processed",
      payment
    });
  } catch (error) {
    console.error("webhook error:", error.message);
    res.status(500).json({ message: "Failed to process webhook" });
  }
};

// GET /payments/:paymentId
const getPaymentById = async (req, res) => {
  try {
    const payment =
      (await Payment.findOne({ paymentId: req.params.paymentId })) ||
      (await Payment.findById(req.params.paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("getPaymentById error:", error.message);
    res.status(500).json({ message: "Failed to get payment" });
  }
};

// GET /payments/order/:orderId
const getPaymentsByOrder = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ orderId: req.params.orderId }, { order_id: req.params.orderId }]
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("getPaymentsByOrder error:", error.message);
    res.status(500).json({ message: "Failed to get payments" });
  }
};

// GET /payments/user/:userId
const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ userId: req.params.userId }, { user_id: req.params.userId }]
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error("getPaymentsByUser error:", error.message);
    res.status(500).json({ message: "Failed to get payments" });
  }
};

// GET /payments/status/:paymentId
const getPaymentStatus = async (req, res) => {
  try {
    const payment =
      (await Payment.findOne({ paymentId: req.params.paymentId })) ||
      (await Payment.findById(req.params.paymentId));

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({
      paymentId: payment.paymentId || payment._id,
      status: payment.status || payment.payment_status
    });
  } catch (error) {
    console.error("getPaymentStatus error:", error.message);
    res.status(500).json({ message: "Failed to get payment status" });
  }
};

module.exports = {
  createPayment,
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