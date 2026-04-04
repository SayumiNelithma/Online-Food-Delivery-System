const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

router.post("/initiate", paymentController.initiatePayment);
router.post("/confirm", paymentController.confirmPayment);
router.post("/cancel", paymentController.cancelPayment);
router.post("/refund", paymentController.refundPayment);
router.post("/webhook", paymentController.webhook);

router.get("/:paymentId", paymentController.getPaymentById);
router.get("/order/:orderId", paymentController.getPaymentsByOrder);
router.get("/user/:userId", paymentController.getPaymentsByUser);
router.get("/status/:paymentId", paymentController.getPaymentStatus);

module.exports = router;
