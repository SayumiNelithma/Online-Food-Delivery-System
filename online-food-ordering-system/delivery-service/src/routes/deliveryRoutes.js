const express = require("express");
const router = express.Router();

const {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getDeliveryByOrder,
  getDeliveriesByRider
} = require("../controllers/deliveryController");

router.post("/", createDelivery);
router.get("/", getAllDeliveries);
router.get("/order/:orderId", getDeliveryByOrder);
router.get("/rider/:riderName", getDeliveriesByRider);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

module.exports = router;