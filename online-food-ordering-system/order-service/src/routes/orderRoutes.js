const express = require("express");
const router = express.Router();

const {
	createOrder,
	getAllOrders,
	getOrderById,
	getOrdersByUser,
	getOrdersByRestaurant,
	updateOrderStatus,
	getOrderPayments,
	refundOrder,
	cancelOrder
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/restaurant/:restaurant_id", getOrdersByRestaurant);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

router.get("/:id/payments", getOrderPayments);
router.post("/:id/refund", refundOrder);
router.put("/:id/cancel", cancelOrder);

module.exports = router;
