const express = require("express");
const router = express.Router();

const {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
} = require("../controllers/menuController");

router.post("/", createMenuItem);
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
