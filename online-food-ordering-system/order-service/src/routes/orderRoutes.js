const express = require("express");
const router = express.Router();

const { getOrderById, updateOrderStatus } = require("../controllers/orderController");

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
