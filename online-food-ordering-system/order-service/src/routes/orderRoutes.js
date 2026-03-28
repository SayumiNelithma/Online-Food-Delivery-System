const express = require("express");
const router = express.Router();

const {
	createOrder,
	getAllOrders,
	getOrderById,
	getOrdersByUser,
	updateOrderStatus,
	payForOrder,
	getOrderPayments,
	refundOrder,
	cancelOrder
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

router.post("/:id/pay", payForOrder);
router.get("/:id/payments", getOrderPayments);
router.post("/:id/refund", refundOrder);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
