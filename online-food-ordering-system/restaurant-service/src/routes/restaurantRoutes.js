const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getMenusByRestaurant,
  updateRestaurantStatus
} = require("../controllers/restaurantController");

router.post("/", createRestaurant);
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurantById);
router.put("/:id", updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.get("/:id/menus", getMenusByRestaurant);
router.put("/:id/status", updateRestaurantStatus);

module.exports = router;