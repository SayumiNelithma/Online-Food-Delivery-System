const express = require("express");
const router = express.Router();

const {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    deleteMenuItemsByRestaurant,
    getMenuItemsByRestaurant,
    updateMenuAvailability
} = require("../controllers/menuController");

router.post("/", createMenuItem);
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.delete("/restaurant/:restaurantId", deleteMenuItemsByRestaurant);
router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);
router.put("/:id/availability", updateMenuAvailability);

module.exports = router;
